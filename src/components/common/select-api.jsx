import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

const SelectApi = ({ value, onChange, options, label, containerClassName }) => {
  return (
    <Autocomplete
      value={options.find((type) => type.name === value) || null}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.name : "");
      }}
      getOptionLabel={(option) => option?.name || ""}
      options={options}
      isOptionEqualToValue={(option, value) => option?.name === value}
      className={containerClassName}
      
      sx={{
        width: { containerClassName }, // Genişliği küçült
        "& .MuiOutlinedInput-root": {
          height: "32px", // Yüksekliği küçült
          fontSize: "12px", // Yazı boyutunu küçült
        },
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.name}>
          {console.log("option:::: ", option)}
          <span
            style={{
              fontWeight: 500,

              width: "100%",
              textAlign: "right",
            }}
          >
            {option.name}
          </span>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Seçiniz"
          variant="outlined" // varsayılan
          sx={{
            "& .MuiInputLabel-root": {
              transform: "translate(6px, 7px) scale(0.8)", // label başlangıç pozisyonu
            },
            "& .MuiInputLabel-shrink": {
              transform: "translate(14px, -8.5px) scale(0.75)", // label yukarı taşındığındaki pozisyon
            },
          }}
        />
      )}
    />
  );
};

SelectApi.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  containerClassName: PropTypes.string,
};

export default SelectApi;
