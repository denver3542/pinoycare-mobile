import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { Avatar, Badge } from "react-native-paper";

// ----------------------------------------------------------------------

const CustomAvatar = forwardRef(
  ({ src, name = "", size = 45, BadgeProps, style, ...other }, ref) => {
    const { color: colorByName, name: charAtName } = getColorByName(name);

    const renderContent = src ? (
      <Avatar.Image ref={ref} source={{ uri: src }} style={style} {...other} />
    ) : (
      <Avatar.Text
        ref={ref}
        label={name ? charAtName : ""}
        style={{
          backgroundColor: colorByName,

          ...style,
        }}
        {...other}
        size={size}
      >
        {name && charAtName}
      </Avatar.Text>
    );

    return BadgeProps ? (
      <Badge
        style={{ position: "absolute", right: -4, bottom: -4 }}
        {...BadgeProps}
      >
        {renderContent}
      </Badge>
    ) : (
      renderContent
    );
  }
);

CustomAvatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  style: PropTypes.object,
  BadgeProps: PropTypes.object,
};

export default CustomAvatar;

// ----------------------------------------------------------------------

function getColorByName(name) {
  const character = (name) => name && name.charAt(0).toUpperCase();

  const colorByName = (name) => {
    const character = (name) => name && name.charAt(0).toUpperCase();

    if (["A", "N", "H", "L", "Q"].includes(character(name))) return "#1976d2"; // primary (blue)
    if (["F", "G", "T", "I", "J"].includes(character(name))) return "#0288d1"; // info (light blue)
    if (["K", "D", "Y", "B", "O"].includes(character(name))) return "#388e3c"; // success (green)
    if (["P", "E", "R", "S", "U"].includes(character(name))) return "#fbc02d"; // warning (yellow)
    if (["V", "W", "X", "M", "Z"].includes(character(name))) return "#d32f2f"; // error (red)

    return "#757575"; // default (grey)
  };

  return {
    name: character(name),
    color: colorByName(name),
  };
}
