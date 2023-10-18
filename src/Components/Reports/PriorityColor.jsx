const PriorityColor = ({ priority }) => {
  let backgroundColor;

  switch (priority) {
    case "Low":
      backgroundColor = "green";
      break;
    case "Medium":
      backgroundColor = "yellow";
      break;
    case "High":
      backgroundColor = "red";
      break;
    default:
      backgroundColor = "white";
  }

  return (
    <span className="w-4 h-4 rounded-full" style={{ backgroundColor }}></span>
  );
};

export default PriorityColor;
