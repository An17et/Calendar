const MonthNavigator = ({ onPrev, onNext, onToday }) => {
  return (
    <div className="month-navigator">
      <button
        className="nav-btn"
        onClick={onPrev}
        aria-label="Previous month"
        id="nav-prev"
      >
        <span>◀</span>
      </button>

      <button
        className="nav-today-btn"
        onClick={onToday}
        id="nav-today"
      >
        Today
      </button>

      <button
        className="nav-btn"
        onClick={onNext}
        aria-label="Next month"
        id="nav-next"
      >
        <span>▶</span>
      </button>
    </div>
  );
};

export default MonthNavigator;
