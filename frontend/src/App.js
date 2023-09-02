import React, { useEffect, useState } from 'react';
import './App.css';

function Cars() {

  const carFormInitialData = {
    id: 0,
    brand: '',
    name: '',
    releaseYear: 0,
    color: ''
  }
  const [carFormData, setCarFormData] = useState(carFormInitialData);
  const [carData, setCarData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarFormData({
      ...carFormData,
      [name]: value
    });
  }

  useEffect(() => {
    fetch('http://localhost:3001/read')
      .then(res => res.json())
      .then(result => setCarData(result));
  }, [carData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isEditMode) {
      // Handle edit mode (PUT request)
      fetch("http://localhost:3001/update", {
        method: "PUT",
        body: JSON.stringify({
          id: editingCarId, // Use the editingCarId to identify the car to update
          name: carFormData.name,
          brand: carFormData.brand,
          releaseYear: carFormData.releaseYear,
          color: carFormData.color,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((result) => {
          // Update the car data with the updated information
          setCarData(result);

          // Reset the form and exit edit mode
          setCarFormData(carFormInitialData);
          setIsEditMode(false);
          setEditingCarId(null);
        });
    } else {
      // Handle create mode (POST request)
      fetch("http://localhost:3001/create", {
        method: "POST",
        body: JSON.stringify({
          id: carFormData.id,
          name: carFormData.name,
          brand: carFormData.brand,
          releaseYear: carFormData.releaseYear,
          color: carFormData.color,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((result) => setCarData(result));

      // Reset the form
      setCarFormData(carFormInitialData);
    }
  };

  const handleDelete = (carId) => {
    /**
     * When clicked on a delete button, get the id of the car's delete button clicked
     * Then use javascript fetch to send DELETE request to NodeJS
     * https://openjavascript.info/2022/01/03/using-fetch-to-make-get-post-put-and-delete-requests/
     */

    fetch("http://localhost:3001/remove", {
      method: "DELETE",
      body: JSON.stringify({
        id: carId
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(result => setCarData(result));
  }

  const handleEdit = (carId) => {
    // Find the car in the carData array based on the carId
    const carToEdit = carData.find((car) => car.id === carId);

    // Set the form data to match the car being edited
    setCarFormData(carToEdit);

    // Set the edit mode and the car being edited
    setIsEditMode(true);
    setEditingCarId(carId);
  };

  const handleClear = (event) => {
    event.preventDefault();
  
    // Reset the form fields to their initial values
    setCarFormData(carFormInitialData);
  };

  return (
    <div className='cars-from-wrapper'>
      <form id="cars-form" onSubmit={handleSubmit} autoComplete="off">
        <label>
          ID:
          <input name='id' type="text" value={carFormData.id} onChange={handleInputChange} />
        </label>
        <label>
          Brand:
          <input name='brand' type="text" value={carFormData.brand} onChange={handleInputChange} />
        </label>
        <label>
          Name:
          <input name='name' type="text" value={carFormData.name} onChange={handleInputChange} />
        </label>
        <label>
          Release Year:
          <input name='releaseYear' type="text" value={carFormData.releaseYear} onChange={handleInputChange} />
        </label>
        <label>
          Color:
          <input name='color' type="text" value={carFormData.color} onChange={handleInputChange} />
        </label>
        <input type="submit" value="Submit" onClick={(e) => handleSubmit(e)} />
        <input type="submit" value="clear" onClick={(e) => handleClear(e)} />
      </form>

      {/* Displays new proprties added to carFormData */}
      <p>
        ID:{carFormData.id},
        Brand:{carFormData.brand},
        Name:{carFormData.name},
        Release Year:{carFormData.releaseYear},
        Color:{carFormData.color}
      </p>

      <h2>Cars Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Release Year</th>
            <th>Color</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {carData.map((car, index) => {
            return (
              <tr key={index}>
                <td>{car.id}</td>
                <td>{car.brand}</td>
                <td>{car.name}</td>
                <td>{car.releaseYear}</td>
                <td>{car.color}</td>
                <td style={{ cursor: 'pointer' }} onClick={() => handleEdit(car.id)}>✎</td>
                <td style={{ cursor: 'pointer' }} onClick={() => handleDelete(car.id)}>🗑</td>
              </tr>)
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Cars;