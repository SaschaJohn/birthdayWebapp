const CosmosClient = require("@azure/cosmos").CosmosClient;
import { useState } from 'react';

Home.getInitialProps = async function () {
  const response = await fetch('http://localhost:3000/api/birthday');
  return await response.json();
};

export default function Home({ CosmoData }) {

  const [name, setName] = useState("");
  const [year, setYear] = useState("1980");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [rerender, setRerender] = useState(false);


  async function getItems() {
    const response = await fetch('http://localhost:3000/api/birthday');
    return await response.json();
  }

  async function handleDelete(id) {
    console.log(id.id);
    const response = await fetch('http://localhost:3000/api/birthday?id=' + id.id, {
      method: 'DELETE',
    });
    setRerender(!rerender);
    return response;
  }

  async function handleCreate() {
    const entry = { name: name, year: year, key: month + '-' + day }
    console.log(entry);

    const response = await fetch('http://localhost:3000/api/birthday', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });
    return response;
  }

  return (
    <div>
      <h2>Birthdays</h2>

      <label htmlFor="name">Name:</label><input id="name" value={name} onChange={(e) => setName(e.target.value)}></input>
      <label htmlFor="month">Month:</label><input id="month" value={month} onChange={(e) => setMonth(e.target.value)}></input>
      <label htmlFor="day">Day:</label><input id="day" value={day} onChange={(e) => setDay(e.target.value)}></input>
      <label htmlFor="number">Year:</label><input id="number" type="number" value={year} onChange={(e) => setYear(e.target.value)}></input>
      <button onClick={handleCreate}>Create</button>
      <table>
        <tbody>
          {CosmoData.map(({ id, name, key, year, _rid }) => (
            <tr>
              <td>{name}</td>
              <td>{key}</td>
              <td>{year}</td>
              <td><button onClick={() => handleDelete({ id })}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}