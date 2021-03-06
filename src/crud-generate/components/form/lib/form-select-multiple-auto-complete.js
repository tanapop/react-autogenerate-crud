import React, { PureComponent } from "react";

/* etc modules */
import PropTypes from "prop-types";

/* my modules */
import BaseAutoComplete from "./base/base-auto-complete";

const FormSelectMultipleAutoComplete = props => (
  <BaseAutoComplete {...props} multi={true} />
);

FormSelectMultipleAutoComplete.propTypes = {
  /* required */
  id: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  extension: PropTypes.shape({
    data: PropTypes.array,
    customSource: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string,
      config: PropTypes.object
    }),
    idAttributeName: PropTypes.string.isRequired,
    labelAttributeName: PropTypes.string.isRequired
  }).isRequired,

  error: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
  /* non required */
  style: PropTypes.object
};

export default FormSelectMultipleAutoComplete;
