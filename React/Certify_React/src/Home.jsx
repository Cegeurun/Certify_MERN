const Home = ({ venues, events, today, sortBy, onSortChange }) => {
  
  const sortEvents = () => {
    let sortValue = document.getElementById("sort").value;
    
    // Save scroll position before reloading
    localStorage.setItem("scrollPosition", window.scrollY);
    
    // Call parent sort handler
    if (onSortChange) {
      onSortChange(sortValue);
    }
  };

  // Restore scroll position after component loads
  React.useEffect(() => {
    let scrollPosition = localStorage.getItem("scrollPosition");
    if (scrollPosition !== null) {
      window.scrollTo(0, scrollPosition);
      localStorage.removeItem("scrollPosition");
    }
  }, []);

  return (
    <>
      {/* ✅ Background Section */}
      <div className="picture">
        <div className="text-box">
          <h1 className="fw-bold">CERTIFY</h1>
          <p>Where Every Show Begins</p>
          <a href="/dashboard" className="hero-btn">BOOK NOW</a>
        </div>
      </div>
      
      {/* ✅ Venues Section */}
      <div className="main-content container-fluid py-4">
        <h2 className="text-center fw-bold mb-4">VENUES</h2>

        <div className="row g-4">
          {venues.map((venue) => (
            <div key={venue.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card shadow p-3 h-100">
                {/* ✅ Venue Image */}
                <img 
                  src={`/static/images/${venue.name.replace(/ /g, '_')}.jpg`}
                  className="card-img-top" 
                  alt={venue.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{venue.name}</h5>
                  <p className="card-text"><strong>Location:</strong> {venue.location}</p>
                  <p className="card-text"><strong>Capacity:</strong> {venue.capacity} seats</p>

                  <p className="card-text"><strong>Pricing:</strong></p>
                  <ul className="list-unstyled">
                    <li>Morning: ₱{venue.morning_price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                    <li>Afternoon: ₱{venue.afternoon_price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                    <li>Evening: ₱{venue.evening_price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                  </ul>

                  <a href="/dashboard" className="btn btn-primary mt-auto">Book Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Events Section */}
      <div className="ms-3 me-3 pt-3">
        <h2 className="text-center fw-bold mb-4">Upcoming Events</h2>

        {/* ✅ Sorting Dropdown */}
        <div className="mb-4 text-center">
          <label htmlFor="sort" className="fw-bold">Sort by:</label>
          <select 
            id="sort" 
            className="form-select w-auto d-inline-block" 
            onChange={sortEvents}
            value={sortBy || 'date'}
          >
            <option value="date">Date</option>
            <option value="time_slot">Time Slot</option>
            <option value="venue">Venue</option>
            <option value="agency">Agency</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* ✅ Events Table */}
        <div className="table-responsive">
          <table className="table table-hover text-center align-middle">
            <thead className="table-dark sticky-header">
              <tr>
                <th>Venue</th>
                <th>Concert Title</th>
                <th>Artist</th>
                <th>Agency</th>
                <th>Date</th>
                <th>Time Slot</th>
              </tr>
            </thead>
            <tbody id="events-table">
              {events.map((event) => (
                <tr 
                  key={event.id}
                  style={{ display: (event.date < today && sortBy !== 'all') ? 'none' : 'table-row' }}
                >
                  <td>{event.venue.name}</td>
                  <td>{event.concert_title}</td>
                  <td>{event.artist_name}</td>
                  <td>{event.user.agency_name}</td>
                  <td>{event.date}</td>
                  <td>{event.time_slot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>    
      </div>
    </>
  );
};

export default Home;
