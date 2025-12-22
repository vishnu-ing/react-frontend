// housing details component
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/auth.interceptor";

// Example mock data
const mockHousing = {
  address: "123 Main St, Springfield",
  roommates: [
    { name: "John Doe", phone: "555-1234" },
    { name: "Jane Smith", phone: "555-5678" },
  ],
};

const HousingDetails = () => {
  const { userId } = useParams();
  const [housing, setHousing] = useState(null);

  useEffect(() => {
    const fetchHousing = async () => {
      try {
        const res = await axiosInstance.get(`/housing/${userId}`);
        setHousing(res.data);
      } catch (error) {
        console.error("Error fetching housing details:", error);
      }
    };
    if (userId) fetchHousing();
  }, [userId]);
        setHousing(res.data);
      } catch (error) {
        console.error("Error fetching housing details:", error);
      }
    };
<<<<<<< HEAD
    if (userId) fetchHousing();
  }, [userId]);
=======
    fetchHousing();
  }, []);
>>>>>>> cf9081f (SCRUM5-SCRUM10-SCRUM11 Added front end functionality for housing and facility reports)

  if (!housing) return <div>Loading...</div>;

  return (
    <div className="housing__content">
      <h2>Housing Details</h2>
      <p>
        <strong>Address:</strong> {housing.address}
      </p>
      <h2>Roommates</h2>
      <ul>
        {Array.isArray(housing.roommates) &&
          housing.roommates.map((roommate, index) => (
            <li key={index}>
              {roommate.name} - {roommate.phone}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default HousingDetails;
