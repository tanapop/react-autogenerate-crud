import React, { Component, Fragment } from "react";

/* etc modules */
import axios from "axios";
import has from "lodash/has";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";

/* custom components */
import BaseTable from "./base-table";
import BaseSearch from "./base-search";
import CustomSnackbar from "../components/etc/custom-snackbar";
import AlertDialog from "../components/etc/alert-dialog";

/* custom configuration */
import TableConf from "../constants/table-conf";

class CRUDGeneration extends Component {
  constructor(props) {
    super(props);

    /* this state spread to the children */
    this.state = {
      data: [],
      loading: false,
      snackbarInfo: {
        type: "error",
        message: "",
        visible: false
      },
      search: {},
      table: {
        sort: "asc",
        orderBy: "",
        page: 1,
        offset: 0,
        limit: props.limit
      },
      dialog: {
        form: {
          visible: false
        },
        alert: {
          visible: false,
          title: "",
          message: "",
          type: ""
        }
      },
      listChecked: [],
      checkAllList: false
    };
  }

  componentDidMount() {
    if (!this.props.existingData) {
      this.getDataFromServer();
    }
  }

  /* create url link, if the user want to refresh or search value, or do limitation */
  getUrlLink = (obj, limit, offset, page) => {
    let url = obj.url;

    if (has(obj, "query")) {
      url = `${obj.url}?`;
      if (has(obj.query, "limit")) {
        url += `&${obj.query.limit}=${limit}`;
      }

      if (has(obj.query, "offset")) {
        url += `&${obj.query.offset}=${offset};`;
      } else if (has(obj.query, "page")) {
        url += `&${obj.query.page}=${page};`;
      }

      // search
      // if (has(obj.query, 'page'))
    }

    return url;
  };

  getDataFromServer = async (limit = null, offset = null, page = null) => {
    try {
      const { search, table } = this.state;
      const { view } = this.props.fetchOptions;

      /* if the parameter null, set to the current value at state */
      if (limit === null) {
        limit = table.limit;
      }

      if (offset === null) {
        offset = table.offset;
      }

      if (page === null) {
        page = table.page;
      }

      /* required data when get data from server */
      let configGetData = has(view, "config") ? view.config : {};
      let methodGetData = has(view, "method")
        ? view.method.toLowerCase()
        : "get";
      let url = has(view, "url")
        ? this.getUrlLink(view, limit, offset, page)
        : "";

      /* start fetching data */
      await this.setLoadingProms(true);
      let { data } = await axios[methodGetData](url, configGetData);

      /* finish fetch data and set data into state */
      this.setState({
        ...this.state,
        data,
        table: {
          ...this.state.table,
          limit,
          offset,
          page
        },
        loading: false
      });
    } catch (e) {
      this.setState({
        ...this.state,
        loading: false,
        snackbarInfo: {
          type: "error",
          message: isArray(e) ? JSON.stringify(e) : e.toString(),
          visible: true
        },
        table: {
          ...this.state.table,
          limit,
          offset,
          page
        }
      });
    }
  };

  setLoadingProms = (loading = false) =>
    new Promise(resolve => this.setState({ ...this.state, loading }, resolve));

  resetSnackbarInfo = () => {
    this.setState({
      ...this.state,
      snackbarInfo: {
        ...this.state.snackbarInfo,
        message: "",
        visible: false
      }
    });
  };

  /* set state table */
  onOrderingColumnTable = (orderByNameColumn, sort) => {
    this.setState({
      ...this.state,
      data: this.orderingData(orderByNameColumn, sort),
      table: {
        ...this.state.table,
        orderBy: orderByNameColumn,
        sort
      }
    });
  };

  orderingData = (orderByNameColumn, sort) => {
    /* sort depend on orderByNameColumn clicked */
    return this.state.data.sort((curr, next) => {
      if (/^[0-9]/g.test(curr[orderByNameColumn])) {
        if (sort === "asc") {
          return curr[orderByNameColumn] - next[orderByNameColumn];
        }
        return next[orderByNameColumn] - curr[orderByNameColumn];
      } else {
        if (sort === "asc") {
          return curr[orderByNameColumn].localeCompare(next[orderByNameColumn]);
        }
        return next[orderByNameColumn].localeCompare(curr[orderByNameColumn]);
      }
    });
  };

  /* setState checked item */
  onClickCheckbox = id => {
    let { listChecked } = this.state;

    if (listChecked.indexOf(id) > -1) {
      listChecked = listChecked.filter(item => item !== id);
    } else {
      listChecked = [...listChecked, id];
    }

    this.setState({
      ...this.state,
      listChecked
    });
  };

  onCheckAllItem = () => {
    let { checkAllList, listChecked, data } = this.state;
    if (!checkAllList === true) {
      listChecked = data.map(item => item[this.props.checkboxOptions.objName]);
    } else {
      listChecked = [];
    }

    this.setState({
      ...this.state,
      listChecked,
      checkAllList: !checkAllList
    });
  };

  /* when user delete data, show alert dialog */
  onClickDelete = () => {
    const { delete: dlt } = this.props.fetchOptions;
    let configDialog = { visible: true, title: "", message: "" };

    if (
      has(dlt, "bulk") &&
      has(dlt.bulk, "enable") &&
      dlt.bulk.enable === true
    ) {
      configDialog = {
        ...configDialog,
        title: "Confirmation",
        message: "Are you sure to delete this data",
        type: "confirmation"
      };
    } else {
      configDialog = {
        ...configDialog,
        title: "Failed",
        message: "Please fill the configuration bulk delete options",
        type: "alert"
      };
    }

    if (this.state.listChecked.length < 1) {
      configDialog = {
        ...configDialog,
        title: "Failed",
        message: "No item checked",
        type: "alert"
      };
    }

    this.setState({
      ...this.state,
      dialog: {
        ...this.state.dialog,
        alert: configDialog
      }
    });
  };

  /* alert dialog */
  onDialogClose = (dialogName, action) => () => {
    if (this.state.dialog[dialogName].visible === true) {
      this.setState({
        ...this.state,
        dialog: {
          ...this.state.dialog,
          [dialogName]: {
            ...this.state.dialog[dialogName],
            visible: false
          }
        }
      });
    }

    if (dialogName === "alert" && action === "submit") {
      this.doDeleteCheckItem();
    } else if (dialogName === "form" && action == "submit") {
      this.doSubmitForm();
    }
  };

  /* submit to delete data */
  doDeleteCheckItem = async () => {
    try {
      const { delete: dlt } = this.props.fetchOptions;
      const dltConfig = dlt.hasOwnProperty("config") ? dlt.config : {};
      await this.setLoadingProms(true);

      let { listChecked } = this.state;
      if (typeof this.props.callbackBeforeBulkDelete !== "undefined") {
        listChecked = this.props.callbackBeforeBulkDelete(
          listChecked,
          this.state.data
        );
      }

      // axios.patch or put (url, data, config);
      const result = await axios[dlt.bulk.method](
        dlt.bulk.url,
        listChecked,
        dltConfig
      );

      this.setState(
        {
          ...this.state,
          loading: false,
          listChecked: [],
          checkAllList: false,
          dialog: {
            ...this.state.dialog,
            alert: {
              visible: false
            }
          },
          snackbarInfo: {
            type: "success",
            message: "Success Delete Your Data",
            visible: true
          }
        },
        () => setTimeout(this.resetSnackbarInfo, 3000)
      );
    } catch (e) {
      this.setState({
        ...this.state,
        loading: false,
        snackbarInfo: {
          visible: true,
          type: "error",
          message: isArray(e) ? JSON.stringify(e) : e.toString()
        }
      });
    }
  };

  /* pagination */
  onChangePage = (e, toValue) => {
    let { page, offset, limit } = this.state.table;
    if (toValue > page - 1) {
      page += 1;
      offset += limit;
    } else {
      page -= 1;
      offset -= limit;
    }

    this.getDataFromServer(null, offset, page);
  };

  /* limitatation */
  onChangeRowsPerPage = event => {
    this.getDataFromServer(event.target.value);
  };

  render() {
    const { classes, classNames } = this.props;
    return (
      <Fragment>
        {/* <BaseSearch /> */}
        <BaseTable
          title={this.props.title}
          data={this.state.data}
          loading={this.state.loading}
          sort={this.state.table.sort}
          page={this.state.table.page}
          limit={this.state.table.limit}
          orderBy={this.state.table.orderBy}
          listChecked={this.state.listChecked}
          checkAllList={this.state.checkAllList}
          tableOptions={this.props.tableOptions}
          loadingOptions={this.props.loadingOptions}
          checkboxOptions={this.props.checkboxOptions}
          onChangePage={this.onChangePage}
          onClickDelete={this.onClickDelete}
          onCheckAllItem={this.onCheckAllItem}
          onClickCheckbox={this.onClickCheckbox}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
          onOrderingColumnTable={this.onOrderingColumnTable}
        />
        <CustomSnackbar
          visible={this.state.snackbarInfo.visible}
          type={this.state.snackbarInfo.type}
          message={this.state.snackbarInfo.message}
          onClickSnackbar={this.resetSnackbarInfo}
        />
        <AlertDialog
          type={this.state.dialog.alert.type}
          title={this.state.dialog.alert.title}
          message={this.state.dialog.alert.message}
          visible={this.state.dialog.alert.visible}
          onClose={this.onDialogClose("alert", "close")}
          onAggree={this.onDialogClose("alert", "submit")}
          onDisaggree={this.onDialogClose("alert", "close")}
        />
      </Fragment>
    );
  }
}

CRUDGeneration.propTypes = {
  limit: PropTypes.oneOf(TableConf.limitValue).isRequired,
  useCheckbox: PropTypes.bool,
  existingData: PropTypes.bool,
  fetchOptions: PropTypes.object,
  tableOptions: PropTypes.object,
  loadingOptions: PropTypes.object,
  checkbox: PropTypes.bool,
  callbackBeforeBulkDelete: PropTypes.func,
  /* required only */
  title: PropTypes.string.isRequired
};

CRUDGeneration.defaultProps = {
  limit: 10,
  fetchOptions: {},
  tableOptions: {},
  checkboxOptions: {
    enabled: false,
    objName: ""
  },
  loadingOptions: {
    color: "primary",
    size: 30
  }
};

export default CRUDGeneration;
