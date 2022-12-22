import { useState } from 'react';

const server = process.env.APPSETTING_server;

Home.getInitialProps = async function (ctx) {

  const response = await fetch(`${server}/api/info`, {
    headers: {
      Authorization: 'Bearer ' + ctx.req.headers["x-ms-token-aad-access-token"]
    }
  });


  var result = await response.json();
  return { result }


};

export default function Home({ result }) {
  const [data, setData] = useState(result);
  var d = JSON.stringify(result);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Info
      </h1><br />
      {d}


    </div>
  );
}