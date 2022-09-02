export const parseErrors = error => {
	let errors = [];
  if (error.request?.status >= 500) {
    errors.push("Something went wrong")
  } else if (error.response.data && typeof (error.response.data) === 'object') {
    const response = error.response.data;
    if (response.detail) {
      errors.push(response.detail)
    } else {
      Object.keys(response).forEach(key => {
        if (key === 'non_field_errors') {
          errors.push(response[key].join(" | "))
        } else {
          errors.push(key + ": " + response[key].join(" | "))
        }
      })
    }
  } else {
    errors.push(error.message)
  }
  return errors
};
