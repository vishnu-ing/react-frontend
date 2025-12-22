// housing details component
import { useEffect, useState } from "react";
import axios from "axios";

// Example mock data
const mockHousing = {
  address: "123 Main St, Springfield",
  roommates: [
    { name: "John Doe", phone: "555-1234" },
    { name: "Jane Smith", phone: "555-5678" },
  ],
};

const HousingDetails = ({ userId }) => {
  const [housing, setHousing] = useState(null);

  // Fetch housing details when component mounts or userId changes
  useEffect(() => {
    const fetchHousing = async () => {
      try {
        const res = await axios.get(`/api/housing/me`);
        setHousing(res.data);
      } catch (error) {
        console.error("Error fetching housing details:", error);
      }
    };
    fetchHousing();
  }, []);

  if (!housing) return <div>Loading...</div>;

  return (
    <div className="housing__content">
      <h2>Housing Details</h2>
      <p>
        <strong>Address:</strong> {housing.address}
      </p>
      <h2>Roommates</h2>
      <ul>
        {housing.roommates.map((roommate, index) => (
          <li key={index}>
            {roommate.name} - {roommate.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HousingDetails;
