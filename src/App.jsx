import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [passengers, setPassengers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [flights, setFlights] = useState([]);
  const [tickets, setTickets] = useState([]);
  
  const [newPassenger, setNewPassenger] = useState({
    fullName: '',
    passportNumber: '',
    birthDate: '',
    phone: '',
  });

  const [newAirline, setNewAirline] = useState({
    name: '',
    airlineCode: '',
    phone: '',
  });

  const [newFlight, setNewFlight] = useState({
    flightNumber: '',
    departure: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    airlineId: '',
  });

  const [newTicket, setNewTicket] = useState({
    ticketNumber: '',
    passengerId: '',
    flightId: '',
    seat: '',
  });

  const [search, setSearch] = useState({
    passengerFullName: '',
    passengerPassport: '',
    passengerPhone: '',
    airlineName: '',
    airlineCode: '',
    airlinePhone: '',
    flightNumber: '',
    flightDeparture: '',
    flightDestination: '',
    ticketNumber: '',
    ticketSeat: '',
  });

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const fetchData = async () => {
    const [passengerRes, airlineRes, flightRes, ticketRes] = await Promise.all([
      axios.get('http://localhost:5000/api/passengers'),
      axios.get('http://localhost:5000/api/airlines'),
      axios.get('http://localhost:5000/api/flights'),
      axios.get('http://localhost:5000/api/tickets'),
    ]);

    setPassengers(passengerRes.data);
    setAirlines(airlineRes.data);
    setFlights(flightRes.data);
    setTickets(ticketRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addPassenger = async () => {
    await axios.post('http://localhost:5000/api/passengers', newPassenger);
    fetchData();
  };

  const addAirline = async () => {
    await axios.post('http://localhost:5000/api/airlines', newAirline);
    fetchData();
  };

  const addFlight = async () => {
    await axios.post('http://localhost:5000/api/flights', newFlight);
    fetchData();
  };

  const addTicket = async () => {
    await axios.post('http://localhost:5000/api/tickets', newTicket);
    fetchData();
  };

  const deleteEntity = async (url, id) => {
    await axios.delete(`${url}/${id}`);
    fetchData();
  };

  const handleSearch = (data, type) => {
    return data.filter((item) => {
      if (type === 'passenger') {
        return (
          item.fullname.toLowerCase().includes(search.passengerFullName.toLowerCase()) &&
          item.passportnumber.toLowerCase().includes(search.passengerPassport.toLowerCase()) &&
          item.phone.toLowerCase().includes(search.passengerPhone.toLowerCase())
        );
      } else if (type === 'airline') {
        return (
          item.name.toLowerCase().includes(search.airlineName.toLowerCase()) &&
          item.airlinecode.toLowerCase().includes(search.airlineCode.toLowerCase()) &&
          item.phone.toLowerCase().includes(search.airlinePhone.toLowerCase())
        );
      } else if (type === 'flight') {
        return (
          item.flightnumber.toLowerCase().includes(search.flightNumber.toLowerCase()) &&
          item.departure.toLowerCase().includes(search.flightDeparture.toLowerCase()) &&
          item.destination.toLowerCase().includes(search.flightDestination.toLowerCase())
        );
      } else if (type === 'ticket') {
        return (
          item.ticketnumber.toLowerCase().includes(search.ticketNumber.toLowerCase()) &&
          item.seat.toLowerCase().includes(search.ticketSeat.toLowerCase())
        );
      }
      return true;
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...passengers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setPassengers(sortedData);
    setSortConfig({ key, direction });
  };

  return (
    <div>
      {/* Поиск по пассажирам */}
      <h1>Список пассажиров</h1>
      <input
        type="text"
        placeholder="Поиск по ФИО"
        value={search.passengerFullName}
        onChange={(e) => setSearch({ ...search, passengerFullName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Поиск по номеру паспорта"
        value={search.passengerPassport}
        onChange={(e) => setSearch({ ...search, passengerPassport: e.target.value })}
      />
      <input
        type="text"
        placeholder="Поиск по телефону"
        value={search.passengerPhone}
        onChange={(e) => setSearch({ ...search, passengerPhone: e.target.value })}
      />
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => handleSort('fullname')}>ФИО</th>
            <th>Номер паспорта</th>
            <th>Телефон</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {handleSearch(passengers, 'passenger').map((passenger) => (
            <tr key={passenger.passengerid}>
              <td>{passenger.passengerid}</td>
              <td>{passenger.fullname}</td>
              <td>{passenger.passportnumber}</td>
              <td>{passenger.phone}</td>
              <td>
                <button onClick={() => deleteEntity('http://localhost:5000/api/passengers', passenger.passengerid)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Добавить пассажира</h2>
      <input type="text" placeholder="ФИО" onChange={(e) => setNewPassenger({ ...newPassenger, fullName: e.target.value })} />
      <input type="text" placeholder="Номер паспорта" onChange={(e) => setNewPassenger({ ...newPassenger, passportNumber: e.target.value })} />
      <input type="date" placeholder="Дата рождения" onChange={(e) => setNewPassenger({ ...newPassenger, birthDate: e.target.value })} />
      <input type="text" placeholder="Телефон" onChange={(e) => setNewPassenger({ ...newPassenger, phone: e.target.value })} />
      <button onClick={addPassenger}>Добавить</button>

      {/* Поиск по авиакомпаниям */}
      <h1>Авиакомпании</h1>
      <input
        type="text"
        placeholder="Поиск по Названию"
        value={search.airlineName}
        onChange={(e) => setSearch({ ...search, airlineName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Поиск по коду"
        value={search.airlineCode}
        onChange={(e) => setSearch({ ...search, airlineCode: e.target.value })}
      />
      <input
        type="text"
        placeholder="Поиск по телефону"
        value={search.airlinePhone}
        onChange={(e) => setSearch({ ...search, airlinePhone: e.target.value })}
      />
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => handleSort('name')}>Название</th>
            <th>Код</th>
            <th>Телефон</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {handleSearch(airlines, 'airline').map((airline) => (
            <tr key={airline.airlineid}>
              <td>{airline.airlineid}</td>
              <td>{airline.name}</td>
              <td>{airline.airlinecode}</td>
              <td>{airline.phone}</td>
              <td>
                <button onClick={() => deleteEntity('http://localhost:5000/api/airlines', airline.airlineid)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Добавить авиакомпанию</h2>
      <input type="text" placeholder="Название" onChange={(e) => setNewAirline({ ...newAirline, name: e.target.value })} />
      <input type="text" placeholder="Код" onChange={(e) => setNewAirline({ ...newAirline, airlineCode: e.target.value })} />
      <input type="text" placeholder="Телефон" onChange={(e) => setNewAirline({ ...newAirline, phone: e.target.value })} />
      <button onClick={addAirline}>Добавить</button>

      {/* Поиск по рейсам */}
      <h1>Рейсы</h1>
      <input
        type="text"
        placeholder="Поиск по Номеру рейса"
        value={search.flightNumber}
        onChange={(e) => setSearch({ ...search, flightNumber: e.target.value })}
      />
      <input
        type="text"
        placeholder="Поиск по Откуда"
        value={search.flightDeparture}
        onChange={(e) => setSearch({ ...search, flightDeparture: e.target.value })}
      />
      <input
        type="text"
        placeholder="Поиск по Куда"
        value={search.flightDestination}
        onChange={(e) => setSearch({ ...search, flightDestination: e.target.value })}
      />
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => handleSort('flightnumber')}>Номер рейса</th>
            <th>Откуда</th>
            <th>Куда</th>
            <th>Время вылета</th>
            <th>Время прибытия</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {handleSearch(flights, 'flight').map((flight) => (
            <tr key={flight.flightid}>
              <td>{flight.flightid}</td>
              <td>{flight.flightnumber}</td>
              <td>{flight.departure}</td>
              <td>{flight.destination}</td>
              <td>{flight.departuretime}</td>
              <td>{flight.arrivaltime}</td>
              <td>{flight.price}</td>
              <td>
                <button onClick={() => deleteEntity('http://localhost:5000/api/flights', flight.flightid)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Добавить рейс</h2>
      <input type="text" placeholder="Номер рейса" onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })} />
      <input type="text" placeholder="Откуда" onChange={(e) => setNewFlight({ ...newFlight, departure: e.target.value })} />
      <input type="text" placeholder="Куда" onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })} />
      <input type="datetime-local" placeholder="Время вылета" onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })} />
      <input type="datetime-local" placeholder="Время прибытия" onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })} />
      <input type="number" placeholder="Цена" onChange={(e) => setNewFlight({ ...newFlight, price: e.target.value })} />
      <input type="text" placeholder="ID авиакомпании" onChange={(e) => setNewFlight({ ...newFlight, airlineId: e.target.value })} />
      <button onClick={addFlight}>Добавить</button>

      {/* Поиск по билетам */}
      <h1>Билеты</h1>
      <input
        type="text"
        placeholder="Поиск по Номеру билета"
        value={search.ticketNumber}
        onChange={(e) => setSearch({ ...search, ticketNumber: e.target.value })}
      />
      <input
        type="text"
        placeholder="Поиск по Месту"
        value={search.ticketSeat}
        onChange={(e) => setSearch({ ...search, ticketSeat: e.target.value })}
      />
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => handleSort('ticketnumber')}>Номер билета</th>
            <th>Пассажир</th>
            <th>Рейс</th>
            <th>Место</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {handleSearch(tickets, 'ticket').map((ticket) => (
            <tr key={ticket.ticketid}>
              <td>{ticket.ticketid}</td>
              <td>{ticket.ticketnumber}</td>
              <td>{ticket.passengerid}</td>
              <td>{ticket.flightid}</td>
              <td>{ticket.seat}</td>
              <td>
                <button onClick={() => deleteEntity('http://localhost:5000/api/tickets', ticket.ticketid)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Добавить билет</h2>
      <input type="text" placeholder="Номер билета" onChange={(e) => setNewTicket({ ...newTicket, ticketNumber: e.target.value })} />
      <input type="text" placeholder="ID пассажира" onChange={(e) => setNewTicket({ ...newTicket, passengerId: e.target.value })} />
      <input type="text" placeholder="ID рейса" onChange={(e) => setNewTicket({ ...newTicket, flightId: e.target.value })} />
      <input type="text" placeholder="Место" onChange={(e) => setNewTicket({ ...newTicket, seat: e.target.value })} />
      <button onClick={addTicket}>Добавить</button>
    </div>
  );
}

export default App;
