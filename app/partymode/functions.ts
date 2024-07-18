// import pg from 'pg'
// const { Pool, Client } = pg 

const {Client } = require('pg')

 export const listenForChanges= async()=> {
    // const pool = new Pool({
    //     connectionString: process.env.DIRECT_URL,
    //   })
       
    //   await pool.query('update-check')
    //   await pool.end()
       
      const client = new Client({
        connectionString: process.env.DIRECT_URL,
      })
       
      client.connect((err: Error | null, client: any, done: () => void) => {
        if (err) {
          console.log('Error connecting to database', err);
        }else {
          console.log('Connected to database');
          client.on('notification', async (msg:any) => {
            const payload = JSON.parse(msg.payload);
            console.log('Change detected:', payload);

            if (payload.action === 'INSERT') {
              console.log('New party added:', payload.data);
            } else if (payload.action === 'UPDATE') {
              console.log('Party updated:', payload.data);
            } else if (payload.action === 'DELETE') {
              console.log('Party deleted:', payload.data);
            }
          });
          client.query('update_check')
        }
      })

    // try {
    //   await client.query('update-check');
    //   console.log('Listening for changes on the Party table...');
  
    //   client.on('notification', async (msg:any) => {
    //     const payload = JSON.parse(msg.payload);
    //     console.log('Change detected:', payload);
  
    //     if (payload.action === 'INSERT') {
    //       console.log('New party added:', payload.data);
    //     } else if (payload.action === 'UPDATE') {
    //       console.log('Party updated:', payload.data);
    //     } else if (payload.action === 'DELETE') {
    //       console.log('Party deleted:', payload.data);
    //     }
    //   });
  
    //   setInterval(() => {
    //     client.query('SELECT 1');
    //   }, 60000);
  
    // } catch (err) {
    //   console.error('Error setting up listener:', err);
    //   client.end()
    // }
  }