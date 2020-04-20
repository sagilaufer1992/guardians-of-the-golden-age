import "./index.scss";

import React, { Fragment } from "react";
import moment from "moment";
import { CircularProgress, Hidden } from '@material-ui/core';

import DatePicker from "./DatePicker";
import { UploadExpectedFile } from "./UploadExpectedFile";

interface Props {
    date: Date;
    interval: number;
    task: (date: Date) => Promise<void>;
    setDate: (date: Date) => void;

    loadExpectedReports?: boolean;
    onExpectedFileUploaded?: () => void;
}

interface State {
    isRefresh: boolean;
}

export default class DatePanel extends React.PureComponent<Props, State> {
    state = { isRefresh: false };

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

    componentDidUpdate(prevProps: Props) {
        if (prevProps.date !== this.props.date) this.refresh();
    }

    render() {
        const { loadExpectedReports, date, onExpectedFileUploaded } = this.props;
        const { isRefresh } = this.state;

        return <div className="date-panel">
            <div className="right-side">
                <DatePicker initDate={date} onDateChanged={this.props.setDate} />
                {loadExpectedReports && onExpectedFileUploaded && 
                    <Fragment>
                        <UploadExpectedFile title="העלאת נתוני חלוקה עבור יום זה" date={date} onUploaded={onExpectedFileUploaded} />
                    </Fragment>
                }

                <div>
                </div>
            </div>
            <Hidden smDown>
                {isRefresh && <CircularProgress className="fault-fetch-progress" size={15} thickness={5} />}
                {this._lastRefreshTime && <div className="last-fault-update">עודכן לאחרונה ב- {moment(this._lastRefreshTime).format("HH:mm DD/MM/YYYY")}</div>}
            </Hidden>
        </div>;
    }

    private _visibilityChange = async () => {
        if (document.visibilityState === "visible") this.refresh();
    }

    public refresh = async () => {
        if (this.state.isRefresh || document.hidden || this._disposed) return;

        this.setState({ isRefresh: true });
        if (this._refreshTimeout) clearTimeout(this._refreshTimeout);

        try {
            await this.props.task(this.props.date);
            this._lastRefreshTime = new Date();
        }
        catch { }

        if (this._disposed) return;

        this._refreshTimeout = setTimeout(this.refresh, this.props.interval);
        this.setState({ isRefresh: false });
    }
}