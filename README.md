# Trade Parsing and Balance Calculator

## Overview

This project provides a server-side application for parsing cryptocurrency trade data from CSV files and calculating asset balances. It is built using Node.js and MongoDB. The application includes endpoints for uploading trade data and querying asset balances at specific timestamps.

## Directory Structure

```
.
├── config
│   └── database.js              # Database connection configuration
├── controllers
│   ├── balanceController.js     # Controller for balance-related operations
│   └── tradeController.js       # Controller for trade-related operations
├── middleware
│   └── uploadMiddleware.js      # Middleware for handling file uploads
├── models
│   ├── balanceModel.js          # Mongoose model for storing asset balances
│   └── tradeModel.js            # Mongoose model for storing trade data
├── routes
│   ├── balanceRoutes.js         # Routes for balance-related endpoints
│   └── tradeRoutes.js           # Routes for trade-related endpoints
├── services
│   ├── balanceService.js        # Service for updating and querying asset balances
│   └── tradeService.js          # Service for inserting trade data into the database
├── utils
│   └── csvUtils.js              # Utility functions for processing CSV files
├── uploads                      # Directory for storing uploaded CSV files
├── .env-sample                  # Sample environment variables file
├── app.js                       # Main application entry point
└── package.json                 # Project metadata and dependencies
└── package-lock.json                 
```

## How It Works?

### 1. Uploading Trade Data

- **CSV File Upload:**
  - The application uses Multer as middleware to handle file uploads. When a CSV file is uploaded to the `/api/trades/upload` endpoint, Multer processes the file and saves it to the `uploads/` directory.

- **File Processing:**
  - After the file is uploaded, the application uses the `csv-parser` library to parse the CSV data. Each row of the CSV file represents a cryptocurrency trade, including details such as the operation type (buy/sell), market, base coin, quote coin, amount, and price.
  - The parsed data is then processed and converted into a format suitable for database storage. The CSV file will be deleted after processing.

- **Database Insertion:**
  - The parsed trade data is inserted into database. Existing trade and balance data are cleared to avoid conflicts, and new data is stored accordingly. During insertion, the data is validated.

### 2. Querying Asset Balances

- **Balance Calculation:**
  - The application calculates asset balances based on the processed trade data whenver a new CSV is uploaded. For each trade, the amount of the base coin is added or subtracted from the user’s balance depending on whether the trade was a buy or sell operation.
  - The balance data is saved in the database with a timestamp to track changes over time.

- **Balance Query:**
  - At any given timestamp, the application can retrieve the asset balances by querying the database for the most recent balance record up to that timestamp.
  - The balance information is returned in a JSON format, showing the current amount of each asset held by the user.

## Database Schema

### 1. Trade Schema

The `Trade` schema is designed to store information about individual cryptocurrency trades.

**Schema Definition:**

```javascript
const tradeSchema = new mongoose.Schema({
  userId: { type: Number, required: true, min: 1 },
  utcTime: { type: Date, required: true },
  operation: { type: String, enum: ['Buy', 'Sell'], required: true },
  market: { type: String, required: true },
  baseCoin: { type: String, required: true },
  quoteCoin: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
});
```

### 2. Balance Schema

The `Balance` schema tracks the asset balances of users at specific timestamps. 

**Schema Definition:**

```javascript
const balanceSchema = new mongoose.Schema({
  userId: { type: Number, required: true, min: 1 },
  timestamp: { type: Date, required: true },
  balances: { type: Map, of: Number, required: true},
});
```

### Schema Design Considerations

- Trade data is stored with detailed fields for each trade, while balance data is aggregated and stored per timestamp to facilitate quick lookup. The balance is stored separately from the trade data to maintain clear separation of concerns.
- Both schemas include validation to enforce data integrity and ensure that all required fields are properly formatted and contain valid values.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com//trade-parsing-balance-calculator.git
   cd trade-parsing-balance-calculator
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Copy the `.env-sample` file to a new `.env` file and add your MongoDB URL and port:

   ```env
   MONGO_DB_URL=your_mongodb_url
   PORT=your_port_number
   ```

4. **Run the Application:**

   ```bash
   npm run start
   ```

## API Endpoints

### Upload Trade Data

- **Endpoint:** `/api/trades/upload`
- **Method:** `POST`
- **Description:** Upload a CSV file to process trade data.
- **Request Body:** Form-data with a file field
  - **Field:** `file` (must be a CSV file)

- **Responses:**

  - **Success (201 Created):**
    ```json
    {
      "message": "File processed and data stored"
    }
    ```
    - **Scenario:** The CSV file was successfully uploaded, processed, and the trade data was stored in the database.

  - **Bad Request (400 Bad Request):**
    ```json
    {
      "error": "No file uploaded"
    }
    ```
    - **Scenario:** The request did not include a file in the form-data, or the file field was missing or the file given was not a CSV. Additioanlly, if you get this error along with "Could not fetch File contents", something with postman cloud went wrong and stopping you from getting access to the sample file. Please download the sample file from [here](https://koinx.notion.site/Take-home-Assignment-Trade-Parsing-and-Balance-Calculator-d5c132912b80430992ea030d69f4d150?pvs=4) and upload locally.

  - **Internal Server Error (500 Internal Server Error):**
    ```json
    {
      "error": "Internal server error"
    }
    ```
    - **Scenario:** An error occurred during the file processing or database operations. This could be due to issues such as file reading errors, database connection problems, or data insertion and validation issues. Check the server logs for more information.

### Query Asset Balance

- **Endpoint:** `/api/balances/timestamp`
- **Method:** `GET`
- **Description:** Retrieve the asset balance at a specified timestamp.
- **Request Body:**
  ```json
  {
    "timestamp": "2022-09-28 12:00:00"
  }
  ```
- **Responses:**

  - **Success (200 OK):**
    ```json
    {
      "BTC": 15,
      "MATIC": 100
    }
    ```
    - **Scenario:** The request was successful, and the asset balances at the specified timestamp are returned. The response contains the balance of each asset at the given timestamp.

  - **Bad Request (400 Bad Request):**
    ```json
    {
      "message": "Timestamp is required"
    }
    ```
    - **Scenario:** The request did not include a timestamp in the body, or the timestamp field was missing.

  - **Not Found (404 Not Found):**
    ```json
    {
      "message": "No balance data found for the given timestamp"
    }
    ```
    - **Scenario:** No balance data was found for the specified timestamp. This is because no trades were recorded before or at that timestamp.

  - **Internal Server Error (500 Internal Server Error):**
    ```json
    {
      "message": "Internal server error"
    }
    ```
    - **Scenario:** An error occurred while processing the request or querying the database. This could be due to issues such as database connection problems or potential errors in the query logic. Check the server logs for more information.

## Postman Collection for API Testing

You can find the Postman collection for both local and deployed API testing [here](https://grey-sunset-50213.postman.co/workspace/New-Team-Workspace~d6a86a99-969a-4dbc-ad00-a754d7609b97/collection/32386223-1ba22697-1531-48b7-a695-2a791b95c808?action=share&creator=32386223).

## Deployment

This project is deployed using MongoDB Atlas for the database and Render for the backend hosting. Please note that the first request to Render might take some time to process due to the server spinning up from an idle state. API endpoints can be tested using tools like Postman (take a look at the collection mentioned above) or cURL by sending requests to this [Render URL](https://trade-parsing-and-balance-calculator-x0dn.onrender.com).
