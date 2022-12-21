const CosmosClient = require("@azure/cosmos").CosmosClient;
import { useState } from 'react';

const server = process.env.APPSETTING_server;

Home.getInitialProps = async function () {
  const response = await fetch(`${server}/api/birthday`);
  var result = await response.json();
  return result;
};

export default function Home({ CosmoData }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("1980");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [rerender, setRerender] = useState(false);
  const [data, setData] = useState(CosmoData);

  async function getItems() {
    const response = await fetch(`${server}/api/birthday`);
    var result = await response.json();
    return result;
  }

  async function handleDelete(id) {
    console.log(id.id);
    const response = await fetch(`${server}/api/birthday?id=` + id.id, {
      method: 'DELETE',
    });
    setRerender(!rerender);

    if (response.ok) { // remove from DOM
      const element = document.getElementById(id.id);
      element.remove();
    }

    return response;
  }

  async function handleCreate() {
    const entry = { name: name, year: year, key: month + '-' + day }

    const response = await fetch(`${server}/api/birthday`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry)
    });

    if (response.ok) { // if HTTP-status is 200-299
      var items = await getItems();
      setData(items.CosmoData);
    }

    return response;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Birthdays
      </h1>

      <label htmlFor="name">Name:</label><input id="name" value={name} onChange={(e) => setName(e.target.value)}></input>
      <label htmlFor="month">Month:</label><input id="month" value={month} onChange={(e) => setMonth(e.target.value)}></input>
      <label htmlFor="day">Day:</label><input id="day" value={day} onChange={(e) => setDay(e.target.value)}></input>
      <label htmlFor="number">Year:</label><input id="number" type="number" value={year} onChange={(e) => setYear(e.target.value)}></input>
      <button className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={handleCreate}>Create</button>
      <table>
        <tbody>
          {data.map(({ id, name, key, year, _rid }) => (
            <tr id={id} key={id}>
              <td>{name}</td>
              <td>{key}</td>
              <td>{year}</td>
              <td><button type="button" className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" onClick={() => handleDelete({ id })}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}