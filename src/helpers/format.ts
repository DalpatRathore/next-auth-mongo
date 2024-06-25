const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  
  export const formatDateTime = (dateString: Date | string): string  => {
    const date = new Date(dateString); // Convert the date string to a Date object
    return DATE_TIME_FORMATTER.format(date);
  };