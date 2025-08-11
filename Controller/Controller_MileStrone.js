const xlsx = require('xlsx');
const Pool = require('./../config/config.js'); // promise-based pool

// const UploadMileStone = async (req, res) => {
//     let connection;
//     try {
//         const { date } = req.body;
//         const file = req.file;
//         console.log(date);
//         console.log('file',file);

//         if (!file || !file.buffer) {
//             return res.status(400).json({ error: 'File is missing or invalid' });
//         }

//         if (!date) {
//             return res.status(400).json({ error: 'Date is required' });
//         }

//         const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//         const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });

//         if (!jsonData || jsonData.length === 0) {
//             return res.status(400).json({ error: 'Excel file is empty' });
//         }

//         // Header to DB mapping (based on your provided Excel)
//         const dbColumnsMapping = {
//             'Client Name': 'client_name',
//             'Product': 'product',
//             'Bucket': 'bucket',
//             'PH': 'ph',
//             'APH': 'aph',
//             'Count': 'allocation_count',
//             'Value in Cr': 'allocation_value_cr',

//             // Milestones
//             '8th': 'milestones_8th',
//             '14th': 'milestones_14th',
//             '21st': 'milestones_21st',
//             '28th': 'milestones_28th',

//             // Achievements
//             '8th_1': 'achievement_8th',
//             '14th_1': 'achievement_14th',
//             '21st_1': 'achievement_21st',
//             '28th_1': 'achievement_28th',

//             // Achievement %
//             '8th_2': 'achievement_percent_8th',
//             '14th_2': 'achievement_percent_14th',
//             '21st_2': 'achievement_percent_21st',
//             '28th_2': 'achievement_percent_28th',

//             // SDLM
//             '8th_3': 'sdlm_8th',
//             '14th_3': 'sdlm_14th',
//             '21st_3': 'sdlm_21st',
//             '28th_3': 'sdlm_28th',

//             // SDBM
//             '8th_4': 'sdbm_8th',
//             '14th_4': 'sdbm_14th',
//             '21st_4': 'sdbm_21st',
//             '28th_4': 'sdbm_28th'
//         };

//         // Track repeated headers like '8th', '14th', etc.
//         const headerCount = {};
//         const headers = Object.keys(jsonData[0]);

//         const finalHeaders = headers.map(header => {
//             if (!headerCount[header]) {
//                 headerCount[header] = 0;
//             } else {
//                 headerCount[header] += 1;
//             }

//             const indexedHeader = headerCount[header] === 0 ? header : `${header}_${headerCount[header]}`;
//             return indexedHeader;
//         });

//         const dbColumns = [];
//         const allValues = [];

//         jsonData.forEach(row => {
//             const rowValues = [];
//             finalHeaders.forEach(originalHeader => {
//                 const dbCol = dbColumnsMapping[originalHeader];
// const excelKey = Object.keys(row).find(key => key.trim() === originalHeader.trim());


//                 if (dbCol) {
//                     if (allValues.length === 0) dbColumns.push(dbCol);
//                     rowValues.push(row[excelKey] !== undefined ? row[excelKey] : null);
//                 }
//             });

//             // Add datewise and created_at
//             rowValues.push(date);             // datewise
//             rowValues.push(new Date());       // created_at

//             allValues.push(rowValues);
//         });

//         dbColumns.push('datewise', 'created_at');

//         if (allValues.length === 0) {
//             return res.status(400).json({ error: 'No valid rows found' });
//         }

//         connection = await Pool.promise().getConnection();
//         await connection.beginTransaction();

//         const placeholders = dbColumns.map(() => '?').join(', ');
//         const insertQuery = `INSERT INTO milestonedata (${dbColumns.join(', ')}) VALUES (${placeholders})`;

//         for (const values of allValues) {
//             await connection.query(insertQuery, values);
//         }

//         await connection.commit();
//         return res.status(201).json({
//             success: true,
//             message: `Inserted ${allValues.length} rows successfully`,
//         });

//     } catch (error) {
//         if (connection) await connection.rollback();
//         console.error('Upload error:', error);
//         res.status(500).json({ error: 'Internal error', details: error.message });
//     } finally {
//         if (connection) connection.release();
//     }
// };






// const UploadMileStone = async (req, res) => {
//     let connection;
//     try {
//         const { date } = req.body;
//         const file = req.file;
//         console.log('Received date:', date);
//         console.log('Received file:', file ? file.originalname : 'No file');

//         if (!file || !file.buffer) {
//             return res.status(400).json({ success: false, message: 'File is missing or invalid' });
//         }

//         if (!date) {
//             return res.status(400).json({ success: false, message: 'Date is required' });
//         }

//         const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];

//         // Ensure raw data is read to preserve original Excel formatting for VARCHAR columns
//         const jsonData = xlsx.utils.sheet_to_json(sheet, { 
//             defval: null,
//             raw: true // This is crucial to get raw cell values, which are then strings
//         });

//         if (!jsonData || jsonData.length === 0) {
//             return res.status(400).json({ success: false, message: 'Excel file is empty or contains no data rows' });
//         }

//         // Header to DB mapping (based on your provided Excel header names)
//         // These keys should exactly match the headers in your Excel file
//         const dbColumnsMapping = {
//             'Client Name': 'client_name',
//             'Product': 'product',
//             'Bucket': 'bucket',
//             'PH': 'ph',
//             'APH': 'aph',
//             'Count': 'allocation_count',
//             'Value in Cr': 'allocation_value_cr',

//             // Milestones - these need to map to the *actual Excel headers* which might be just numbers
//             // If your Excel headers are simply "8", "14", "21", "28" under a "Milestones" merged cell,
//             // xlsx.utils.sheet_to_json will give them generic names like __EMPTY, __EMPTY_1 etc.
//             // You MUST inspect your actual jsonData headers to get this right.
//             // For now, assuming they are exactly '8th', '14th', '21st', '28th' in the Excel row.
//             '8th': 'milestones_8th',
//             '14th': 'milestones_14th',
//             '21st': 'milestones_21st',
//             '28th': 'milestones_28th',

//             // Achievements
//             // Adjust these to match the actual headers in your parsed jsonData.
//             // If excel headers are just '8', '14' etc. and you have multiple,
//             // sheet_to_json will rename them. E.g., '8_1', '8_2'.
//             // You need to confirm the exact names `xlsx.utils.sheet_to_json` assigns.
//             '8th_1': 'achievement_8th', // Example: '8th_1' if the second '8th' column is renamed
//             '14th_1': 'achievement_14th',
//             '21st_1': 'achievement_21st',
//             '28th_1': 'achievement_28th',

//             // Achievement %
//             '8th_2': 'achievement_percent_8th',
//             '14th_2': 'achievement_percent_14th',
//             '21st_2': 'achievement_percent_21st',
//             '28th_2': 'achievement_percent_28th',

//             // SDLM
//             '8th_3': 'sdlm_8th',
//             '14th_3': 'sdlm_14th',
//             '21st_3': 'sdlm_21st',
//             '28th_3': 'sdlm_28th',

//             // SDBM
//             '8th_4': 'sdbm_8th',
//             '14th_4': 'sdbm_14th',
//             '21st_4': 'sdbm_21st',
//             '28th_4': 'sdbm_28th'
//         };

//         // --- IMPORTANT: Dynamic Header Renaming Logic ---
//         // xlsx.utils.sheet_to_json often renames duplicate headers by appending "_1", "_2", etc.
//         // You need to inspect the `jsonData[0]` to see what exact keys are generated.
//         // Example: If Excel has two columns named "8th", they might become "8th" and "8th_1" in `jsonData`.
//         // Your `dbColumnsMapping` keys must match these generated keys.

//         // A more dynamic way to map parsed JSON keys to DB columns
//         // This assumes a consistent order and pattern in your Excel,
//         // or you manually verify the generated keys from `sheet_to_json`.
//         const parsedExcelHeaders = Object.keys(jsonData[0]);
//         const actualDbColumnsToInsert = [];
//         const excelKeyToDbColumnMap = {};

//         // Build the mapping from the parsed Excel headers to your DB columns
//         let milestoneCounter = 0;
//         let achievementCounter = 0;
//         let achievementPercentCounter = 0;
//         let sdlmCounter = 0;
//         let sdbmCounter = 0;

//         for (const excelHeader of parsedExcelHeaders) {
//             const trimmedHeader = excelHeader.trim();

//             if (dbColumnsMapping[trimmedHeader]) {
//                 actualDbColumnsToInsert.push(dbColumnsMapping[trimmedHeader]);
//                 excelKeyToDbColumnMap[excelHeader] = dbColumnsMapping[trimmedHeader];
//             } else if (trimmedHeader === '8th' || trimmedHeader === '14th' || trimmedHeader === '21st' || trimmedHeader === '28th') {
//                 // This block handles the numbered milestone/achievement columns
//                 // You will need to carefully adjust the logic based on how
//                 // xlsx.utils.sheet_to_json renames your specific Excel file's headers.

//                 // Example: If '8th' comes first for milestones, then achievements, then percent, etc.
//                 // This is a simplified example; a robust solution might require a more
//                 // explicit definition of the header order from your Excel file.
//                 if (milestoneCounter === 0) { // First occurrence of 8th/14th/21st/28th
//                     actualDbColumnsToInsert.push(`milestones_${trimmedHeader}`);
//                     excelKeyToDbColumnMap[excelHeader] = `milestones_${trimmedHeader}`;
//                     milestoneCounter++;
//                 } else if (achievementCounter === 0) { // Second occurrence
//                     actualDbColumnsToInsert.push(`achievement_${trimmedHeader}`);
//                     excelKeyToDbColumnMap[excelHeader] = `achievement_${trimmedHeader}`;
//                     achievementCounter++;
//                 } // ... continue for achievement_percent, sdlm, sdbm if their headers are also just '8th', '14th', etc.
//             }
//              // For a robust solution, it's highly recommended to:
//              // 1. Manually parse a sample Excel file using `xlsx.utils.sheet_to_json`
//              //    and `console.log(Object.keys(jsonData[0]))` to see the exact keys generated.
//              // 2. Adjust your `dbColumnsMapping` keys to precisely match those generated keys.
//              //    E.g., if xlsx generates `__EMPTY` for the first '8th' and `__EMPTY_1` for the second,
//              //    your mapping should be `{'__EMPTY': 'milestones_8th', '__EMPTY_1': 'achievement_8th', ...}`
//              //    OR use a more sophisticated header parsing method if Excel headers are very complex (e.g., two rows of headers).
//         }

//         // Example assuming your `dbColumnsMapping` keys exactly match the keys produced by xlsx.utils.sheet_to_json
//         // This is the most straightforward approach if you can control the Excel header exactness or adapt to xlsx's renaming.
//         const finalDbColumns = [];
//         const processedRows = [];

//         for (const row of jsonData) {
//             const currentRowValues = [];
//             for (const excelHeader in dbColumnsMapping) { // Iterate through your defined mappings
//                 const dbColumn = dbColumnsMapping[excelHeader];
//                 const value = row[excelHeader] !== undefined ? String(row[excelHeader]) : null; // Convert all values to string

//                 // Only add to finalDbColumns once (from the first row) to define the INSERT statement columns
//                 if (processedRows.length === 0) {
//                     finalDbColumns.push(dbColumn);
//                 }
//                 currentRowValues.push(value);
//             }
//             // Add datewise and created_at
//             currentRowValues.push(date);          // datewise
//             currentRowValues.push(new Date());    // created_at
//             processedRows.push(currentRowValues);
//         }

//         // Add datewise and created_at to the list of columns for the SQL query
//         finalDbColumns.push('datewise', 'created_at');

//         if (processedRows.length === 0) {
//             return res.status(400).json({ success: false, message: 'No valid data rows found after processing Excel file' });
//         }

//         connection = await Pool.promise().getConnection();
//         await connection.beginTransaction();

//         const placeholders = finalDbColumns.map(() => '?').join(', ');
//         const insertQuery = `INSERT INTO milestonedata (${finalDbColumns.join(', ')}) VALUES (${placeholders})`;

//         console.log('Insert Query:', insertQuery);
//         // console.log('Sample Values for Insert (first row):', processedRows[0]); // For debugging

//         for (const values of processedRows) {
//             await connection.query(insertQuery, values);
//         }

//         await connection.commit();
//         return res.status(201).json({
//             success: true,
//             message: `Successfully uploaded and inserted ${processedRows.length} rows.`,
//         });

//     } catch (error) {
//         if (connection) await connection.rollback();
//         console.error('Upload error:', error);
//         // Provide more details in the error response for debugging
//         res.status(500).json({ success: false, message: 'Failed to upload data', details: error.message, stack: error.stack });
//     } finally {
//         if (connection) connection.release();
//     }
// };






// const getMileStoneData = async(req,res)=>{


//     const {month , year} = req.body;
//     console.log("year is ",year);
//     console.log("month is month",month);



//      const [rows] = await Pool.promise().query('Select * from milestonedata');


//      return  res.status(201).json({success : true , data : rows});







// }




const UploadMileStone = async (req, res) => {
    let connection;
    try {
        const { date } = req.body;
        const file = req.file;
        console.log('Received date:', date);
        console.log('Received file:', file ? file.originalname : 'No file');

        if (!file || !file.buffer) {
            return res.status(400).json({ success: false, message: 'File is missing or invalid.' });
        }

        if (!date) {
            return res.status(400).json({ success: false, message: 'Date is required.' });
        }

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Ensure raw data is read to preserve original Excel formatting for VARCHAR columns
        // headers: 1 tells sheet_to_json to output an array of arrays (rows)
        // raw: true gets the raw cell values without type conversion
        const jsonData = xlsx.utils.sheet_to_json(sheet, {
            header: 1, // Get data as array of arrays, useful for custom header parsing
            defval: null,
            raw: true
        });

        if (!jsonData || jsonData.length < 2) { // Need at least 2 rows: one for headers, one for data
            return res.status(400).json({ success: false, message: 'Excel file is empty or contains no data rows besides headers.' });
        }

        // --- Custom Header Parsing ---
        // This is the most crucial part for robust Excel parsing.
        // You need to manually define the expected order of headers and map them to your DB columns.
        // Adjust these arrays to match the EXACT headers in your Excel file, in their EXACT order.
        // If your Excel has merged cells, sheet_to_json might simplify them.
        // It's best to inspect `jsonData[0]` from a sample file if you're unsure.

        // Expected Excel Headers in order (Adjust these to YOUR EXACT EXCEL HEADERS)
        const expectedExcelHeaders = [
            'Client Name', 'Product', 'Bucket', 'PH', 'APH', 'Count', 'Value in Cr',
            '8th', '14th', '21st', '28th', // Milestones
            '8th', '14th', '21st', '28th', // Achievement
            '8th', '14th', '21st', '28th', // Achievement %
            '8th', '14th', '21st', '28th', // SDLM
            '8th', '14th', '21st', '28th'  // SDBM
        ];

        // Corresponding Database Column Names
        const dbColumnNames = [
            'client_name', 'product', 'bucket', 'ph', 'aph', 'allocation_count', 'allocation_value_cr',
            'milestones_8th', 'milestones_14th', 'milestones_21st', 'milestones_28th',
            'achievement_8th', 'achievement_14th', 'achievement_21st', 'achievement_28th',
            'achievement_percent_8th', 'achievement_percent_14th', 'achievement_percent_21st', 'achievement_percent_28th',
            'sdlm_8th', 'sdlm_14th', 'sdlm_21st', 'sdlm_28th',
            'sdbm_8th', 'sdbm_14th', 'sdbm_21st', 'sdbm_28th'
        ];

        // Validate that the number of expected headers matches actual headers from first row
        const actualHeadersRow = jsonData[0]; // First row is headers
        if (actualHeadersRow.length !== expectedExcelHeaders.length) {
             console.warn('Header count mismatch! Expected:', expectedExcelHeaders.length, 'Actual:', actualHeadersRow.length);
             // You might want to return an error here, or try a fallback if headers are inconsistent.
             // For a robust system, strict header matching is usually preferred.
             // return res.status(400).json({ success: false, message: 'Excel header columns do not match expected format. Please ensure all 27 expected columns are present.' });
        }
        
        // You can also add a check to verify header names if needed
        // for (let i = 0; i < expectedExcelHeaders.length; i++) {
        //     if (actualHeadersRow[i] !== expectedExcelHeaders[i]) {
        //         console.warn(`Header mismatch at index ${i}: Expected "${expectedExcelHeaders[i]}", Got "${actualHeadersRow[i]}"`);
        //     }
        // }


        const processedRows = [];
        // Start from the second row (index 1) as the first row is headers
        for (let i = 1; i < jsonData.length; i++) {
            const rowData = jsonData[i];
            const currentRowValues = [];

            if (rowData.length === 0 || rowData.every(val => val === null)) {
                // Skip completely empty rows
                continue;
            }

            // Iterate through the `dbColumnNames` array to ensure correct order for insertion
            // This also ensures we only pick values for the columns we expect.
            for (let j = 0; j < dbColumnNames.length; j++) {
                let value = rowData[j]; // Get value from Excel row by index

                // Handle null/undefined values and convert to string
                if (value === undefined || value === null) {
                    value = null;
                } else {
                    // Check if it's a number and needs rounding
                    if (typeof value === 'number') {
                        // Round to 2 decimal places. Using toFixed(2) returns a string.
                        // If you need it as a number for further calculations before converting to string,
                        // use Math.round(value * 100) / 100
                        value = value.toFixed(2);
                    }
                    value = String(value); // Ensure all values are stored as strings for VARCHAR columns
                }
                currentRowValues.push(value);
            }

            // Add datewise and created_at columns at the end
            currentRowValues.push(date);          // datewise
            currentRowValues.push(new Date());    // created_at
            processedRows.push(currentRowValues);
        }

        if (processedRows.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid data rows found in the Excel file after processing.' });
        }

        connection = await Pool.promise().getConnection();
        await connection.beginTransaction();

        // Construct the INSERT query using the `dbColumnNames` array
        const finalDbColumnsForInsert = [...dbColumnNames, 'datewise', 'created_at'];
        const placeholders = finalDbColumnsForInsert.map(() => '?').join(', ');
        const insertQuery = `INSERT INTO milestonedata (${finalDbColumnsForInsert.join(', ')}) VALUES (${placeholders})`;

        console.log('Insert Query:', insertQuery);
        // console.log('Sample Values for Insert (first row):', processedRows[0]); // For debugging

        for (const values of processedRows) {
            await connection.query(insertQuery, values);
        }

        await connection.commit();
        return res.status(201).json({
            success: true,
            message: `Successfully uploaded and inserted ${processedRows.length} rows.`,
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Upload error:', error);
        // Provide more details in the error response for debugging
        res.status(500).json({ success: false, message: 'Failed to upload data', details: error.message, stack: error.stack });
    } finally {
        if (connection) connection.release();
    }
};

const getMileStoneData = async (req, res) => {
    let connection; // Declare connection variable here
    try {
        const { month, year } = req.body;
        console.log("Fetching data for year:", year);
        console.log("Fetching data for month:", month);

        if (!month || !year) {
            return res.status(400).json({ success: false, message: 'Month and year are required for filtering.' });
        }

        connection = await Pool.promise().getConnection();

        // Convert month name to a month number (1-12)
        // This is crucial for filtering by month in SQL, especially with DATE types.
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthNumber = monthNames.indexOf(month) + 1; // +1 because array is 0-indexed, months are 1-indexed

        if (monthNumber === 0) { // If indexOf returns -1, it means month name wasn't found
            return res.status(400).json({ success: false, message: 'Invalid month provided.' });
        }

        // Construct the SQL query to filter by month and year from the 'datewise' column
        const query = `
            SELECT * FROM milestonedata 
            WHERE YEAR(datewise) = ? AND MONTH(datewise) = ?;
        `;
        const [rows] = await connection.query(query, [year, monthNumber]);

        if (rows.length === 0) {
            return res.status(200).json({ success: true, message: 'No data found for the selected month and year.', data: [] });
        }

        return res.status(200).json({ success: true, data: rows });

    } catch (error) {
        console.error('Error fetching milestone data:', error);
        // Do not return `details` or `stack` in production environments for security reasons.
        // For development, it's helpful.
        res.status(500).json({ success: false, message: 'Internal server error', details: error.message, stack: error.stack });
    } finally {
        if (connection) connection.release(); // Ensure connection is released even if an error occurs
    }
};



module.exports = { UploadMileStone   , getMileStoneData };
