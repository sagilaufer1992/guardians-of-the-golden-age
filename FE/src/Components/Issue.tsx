import React from "react";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import CardContent from "@material-ui/core/CardContent";
import "./Issue.css";

type IssueStatus = "active" | "in-progress" | "done";

interface Props {
  region: string;
  stationName: string;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
}

export default React.memo(function Issue(props: Props) {
  return (
    <Card className="issue">
      <CardContent className="issue-content">
        <div className="content-and-status">
          <div className={classnames("status", props.status)} />
          <div className="content">
            <div className="region">{props.region}</div>
            <div className="station-name">{props.stationName}</div>
            <div className="category-and-description">
              <Chip
                className="category"
                variant="outlined"
                color="primary"
                label={props.category}
              ></Chip>
              <span>{props.description}</span>
            </div>
          </div>
        </div>
        <div className="history">
          <Chip label="הצג היסטוריית טיפול"></Chip>
        </div>
      </CardContent>
    </Card>
  );
});
