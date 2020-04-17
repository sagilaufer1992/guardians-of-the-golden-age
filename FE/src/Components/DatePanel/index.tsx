import React from "react";
import moment from "moment";
import { CircularProgress, Hidden } from '@material-ui/core';

import DatePicker from "./DatePicker";

interface Props {
    interval: number;
    task: (date: Date) => Promise<void>;
}

interface State {
    isRefresh: boolean;
    date: Date;
}

export default class DatePanel extends React.PureComponent<Props, State> {
    state = { isRefresh: false, date: moment().startOf('day').toDate() };

    private _lastRefreshTime: Date | null = null;
    private _refreshTimeout: any | null = null;

    private _disposed: boolean = false;

    componentDidMount() {
        document.addEventListener("visibilitychange", this._visibilityChange);
        this.refresh();
    }

    componentWillUnmount() {
        this._disposed = true;
        document.removeEventListener("visibilitychange", this._visibilityChange);
        clearTimeout(this._refreshTimeout);
    }

    componentDidUpdate(_: Props, prevState: State) {
        if (prevState.date !== this.state.date) this.refresh();
    }

    render() {
        const { isRefresh } = this.state;

        return <div className="date-panel">
            <DatePicker onDateChanged={this._updateDate} />
            <Hidden smDown>
                {isRefresh && <CircularProgress className="fault-fetch-progress" size={15} thickness={5} />}
                {this._lastRefreshTime && <div className="last-fault-update">עודכן לאחרונה ב- {moment(this._lastRefreshTime).format("HH:mm DD/MM/YYYY")}</div>}
            </Hidden>
        </div>;
    }

    private _updateDate = (date: Date) => this.setState({ date });

    private _visibilityChange = async () => {
        if (document.visibilityState === "visible") this.refresh();
    }

    public refresh = async () => {
        if (this.state.isRefresh || document.hidden || this._disposed) return;

        this.setState({ isRefresh: true });
        if (this._refreshTimeout) clearTimeout(this._refreshTimeout);

        try {
            await this.props.task(this.state.date);
            this._lastRefreshTime = new Date();
        }
        catch { }
        finally {
            if (this._disposed) return;
            
            this._refreshTimeout = setTimeout(this.refresh, this.props.interval);
            this.setState({ isRefresh: false });
        }
    }
}