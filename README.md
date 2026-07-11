# Flight booking

The challenge was to build a simple flight booking web application from start to finish.

*This initially started as an interview task focused only on the front end, but after the interview I decided to continue working on it as a personal project and turn it into a full-stack application by adding a backend and additional features.*

For the frontend, I used React. For data storage and backend services, I used Supabase. This was my first time working with Supabase and my first hands-on experience with backend development in a real project.

The application uses two database tables:

- One table stores airport data, which is fetched once during the initial application load.
- The second table stores booked flights, allowing users to create and delete flight records.

One of the more interesting features I implemented was infinite scrolling, which was also a first for me. The flights table initially loads only five records. As the user scrolls, the next five records are fetched through additional API requests to the database, followed by the next five, and so on until all records have been loaded.

Live Site URL on which you can check out the project: https://adrianptrv.github.io/flight-booking-react

<table>
  <tr>
    <td>Desktop layout</td>
    <td>Mobile layout</td>
  </tr>
    <tr>
      <td>
        <img src="https://github.com/user-attachments/assets/ff122c63-a69f-410e-bfc4-81251982ca59" />
      </td>
      <td>
        <img src="https://github.com/user-attachments/assets/c9ca8489-e8b9-421b-803a-430a8ef7647e" />
      </td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <strong>Infinite scrolling</strong>
      </td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <video loop autoplay muted src="https://github.com/user-attachments/assets/0d1892fa-6175-43d9-88bb-9e0463c12332" />
      </td>
    </tr>
</table>


