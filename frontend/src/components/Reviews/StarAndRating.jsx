const StarAndRating = ({ avgRating }) => {
  let formatRating;
  
  if (avgRating === null || avgRating === undefined || isNaN(avgRating)) {
    formatRating = 'New*';
  } else {
    const rating = parseFloat(avgRating);
    
    if (rating % 1 === 0) {
      formatRating = rating.toFixed(1);
    } else {
      formatRating = rating.toFixed(2);
    }
  }

  return (
    <div className="starRating" data-testid='spot-rating'>
      <span role="img" aria-label="star">⭐</span>
      <span>{formatRating}</span>
    </div>
  );
}

export default StarAndRating;
