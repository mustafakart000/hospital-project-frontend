import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

// Kan grupları için veri seti
const bloodTypes = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "0+", label: "0+" },
  { value: "0-", label: "0-" },
];

const BloodTypeSelector = ({ value, onChange }) => {
  return (
    <Autocomplete
      value={bloodTypes.find((type) => type.value === value) || null}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.value : "");
      }}
      getOptionLabel={(option) => option?.label || ""}
      options={bloodTypes}
      isOptionEqualToValue={(option, value) => option.value === value}
      sx={{
        width: "196.8px", // Genişliği küçült
        
        "& .MuiOutlinedInput-root": {
          height: "36px", // Yüksekliği küçült
          fontSize: "15px", // Yazı boyutunu küçült
        },
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.value}>
          <span
            style={{
              fontWeight: 500,
              color: option.value.includes("-") ? "#d1847b" : "#68da97",
              width: "100%",
              textAlign: "right",
            }}
          >
            {option.label}
          </span>
        </li>
      )}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Kan Grubu" 
          placeholder="Seçiniz"
          variant="outlined"  // varsayılan
          sx={{
            '& .MuiInputLabel-root': {
              transform: 'translate(6px, 7px) scale(0.8)',  // label başlangıç pozisyonu
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(14px, -8.5px) scale(0.75)',  // label yukarı taşındığındaki pozisyon
            }
          }}
        />
      )}
    />
  );
};

BloodTypeSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default BloodTypeSelector;
