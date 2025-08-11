const Pool = require('./../config/config')
const bcrypt = require('bcryptjs');
const {sendOtpEmail} = require('./../config/sendOtp');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');






const xlsx = require('xlsx')
const fs = require('fs/promises'); 

const { table } = require('console');

let otpStore = {};




// const UserLogin = async(req,res)=>{

//     const {email , password , selectedRole } =  req.body;

//     console.log("selected role from frontend",selectedRole);


//     console.log(req.body);

   
//     try{ 
//           const [users] =  await Pool.promise().query('Select * from users where email = ? ',[email]);
//           if(users.length==0){
//               res.status(400).json({success : false , message  : "User Not Found"});
//           }

//           const user = users[0];



//           if(user.role != selectedRole){
//              return res.status(403).json({success : false , message : "Accesss Denied Role Not Match"});
//           }

//           const passwordmatch = await bcrypt.compare(password,user.password);


//           if(!passwordmatch){
//                 res.status(401).json({success : false , message : "Invalid Credentials"});
//           }

//           const otp  = Math.floor(100000 + Math.random()*900000);

//           otpStore[email] =  {otp,expires : Date.now()+5*60*1000 , attempts :0};



//           console.log("My Otp is ",otpStore);


//           await sendOtpEmail(email , otp);

//           res.status(201).json({success : true , message : "OTP SEND SUCCESSFULLY"});   

//     }catch(err){
//          res.status(500).json({success : false , message : err.message})
//     }
// }




const UserLogin = async (req, res) => {
  const { email, password, selectedRole } = req.body;

  console.log("Selected role from frontend:", selectedRole);
  console.log("Request body:", req.body);

  try {
    const [users] = await Pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: "User Not Found" });
    }

    const user = users[0];

    if (user.role !== selectedRole) {
      return res.status(403).json({ success: false, message: "Access Denied: Role does not match" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
    };

    console.log("Generated OTP:", otpStore);

    await sendOtpEmail(email, otp);

    return res.status(201).json({ success: true, message: "OTP sent successfully" });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


const UserSignup = async (req, res) => {
  const { email, password, role } = req.body;

  console.log("Email i s",email);
  console.log("password is",password);
  console.log("Role ",role);

  try {
    const [userExists] = await Pool.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const saltRounds = 10;
    const hashpassword = await bcrypt.hash(password, saltRounds);

    await Pool.promise().query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashpassword, role]
    );

    res.status(200).json({ success: true, message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};





const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("My input otp",otp);
  const session_token = uuidv4();
    const ip = req.ip;
  const user_agent = req.headers['user-agent'];

    const stored = otpStore[email];
    if (!stored || stored.expires < Date.now()) {
    return res.status(401).json({ success: false, message: 'OTP expired, new OTP sent' });
  }

  console.log("Store opt is ",otpStore);

  if (stored.otp != otp) {
      otpStore[email].attempts += 1;
      console.log("updage otp state ",otpStore);
    if (otpStore[email].attempts >= 3) {
      const newOtp = Math.floor(100000 + Math.random() * 900000);
      otpStore[email] = { otp: newOtp, expires: Date.now() + 5 * 60 * 1000, attempts: 0 };
          await sendOtpEmail(email, newOtp);
      return res.status(401).json({ success: false, message: 'Too many failed attempts. New OTP sent.' });
      }
    return res.status(401).json({ success: false, message: 'Invalid OTP. Try again.' });
  }

  console.log("Verify otp state");

  delete otpStore[email]; // clean up OTP

  const [userRow] = await Pool.promise().query('SELECT id , role FROM users WHERE email = ?', [email]);
    const userId = userRow[0].id
  
    await Pool.promise().query(
    'INSERT INTO Sessions (user_id, session_token, user_agent, ip_address) VALUES (?, ?, ?, ?)',
    [userId, session_token, user_agent, ip]
  );

  res.cookie('session_token', session_token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,

  });
   
  const roletype = userRow[0].role;

  console.log("verify role",roletype);

  res.json({ success: true, message: 'Login successful' , user : {id  : userId , email : email , role : roletype}});
};




    const Logout = async (req, res) => {
         
         console.log("call logout");
         const token = req.cookies.session_token;
         console.log("token is ",token);
  if (token) {
    await Pool.promise().query('UPDATE Sessions SET is_active = FALSE WHERE session_token = ?', [token]);
    res.clearCookie('session_token');
  }
  res.json({ success: true, message: 'Logged out successfully' });

    };





    const GetUser = async (req,res)=>{

             console.log("cAll user ");
            const token = req.cookies.session_token;


            if(!token){
                return res.status(401).json({ success: false, message: "No session token" });
            }


            const [rows] =  await Pool.promise().query('SELECT Users.id, Users.email , Users.role FROM Sessions JOIN Users ON Sessions.user_id = Users.id WHERE Sessions.session_token = ? AND Sessions.is_active = TRUE',[token]);


             if (!rows.length) {
    return res.status(401).json({ success: false, message: "Invalid session" });
  }

  return res.json({ success: true, user: rows[0] });

    }


// const fs = require('fs/promises');
// const xlsx = require('xlsx');
// const Pool = require('../config/db'); // adjust as needed

const parseExcel = async (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet);
};

const cleanupFiles = async (filePaths) => {
  try {
    await Promise.all(filePaths.map(path => fs.unlink(path)));
  } catch (error) {
    console.error('Error cleaning up files:', error.message);
  }
};

const transformData = async (attendanceData, tl) => {
  return attendanceData.map(record => {
    const records = Array(31).fill().map((_, i) => {
      const day = i + 1;
      return record[`Day ${day}`] === 'P' ? 'P' : 'A';
    }).join(',');

    return {
      emp_code: record['Employee Code'] || '',
      emp_name: record['Employee Name'] || '',
      attendance_records: records,
      team_leader: tl,
      upload_date: new Date()
    };
  });
};












// const UploadAttendence = async (req, res) => {
//   const { tl } = req.body;
//   const files = req.files;

  

//   console.log("backend hit tl:", tl);
//   console.log("files received:", files);

//   if (!files?.attendance?.[0] || !tl) {
//     return res.status(400).json({ error: 'Missing attendance file or TL selection' });
//   }

//   let connection;
//   try {
//     connection = await Pool.promise().getConnection();

//     const attendanceData = await parseExcel(files['attendance'][0].path);
//     const transformedData = await transformData(attendanceData, tl);

//     await connection.beginTransaction();

//     const insertOrUpdateQuery = `
//       INSERT INTO attendance (emp_code, emp_name, attendance_records,Process, upload_date)
//       VALUES ?
//       ON DUPLICATE KEY UPDATE 
//         emp_name = VALUES(emp_name),
//         attendance_records = VALUES(attendance_records),
//         Process = VALUES(Process),
//         upload_date = VALUES(upload_date)
//     `;

//     const values = transformedData.map(record => [
//       record.emp_code,
//       record.emp_name,
//       record.attendance_records,
//       record.team_leader,
//       record.upload_date
//     ]);


//     console.log("valuesa are",values);


    

//     await connection.query(insertOrUpdateQuery, [values]);

//     await connection.commit();

//     // Cleanup uploaded file
//     const filePaths = Object.values(files).flat().map(file => file.path);
//     await cleanupFiles(filePaths);

//     return res.status(201).json({
//       message: 'Attendance records processed successfully',
//       recordsProcessed: transformedData.length
//     });

//   } catch (error) {
//     if (connection) await connection.rollback();

//     console.error('Error in UploadAttendance:', error);

//     if (files) {
//       const filePaths = Object.values(files).flat().map(file => file.path);
//       await cleanupFiles(filePaths);
//     }

//     return res.status(500).json({
//       error: 'Failed to process attendance records',
//       details: error.message
//     });

//   } finally {
//     if (connection) connection.release();
//   }
// };



// const UploadAttendence = async (req, res) => {
//   const { tl: process } = req.body; // Treat `tl` as process
//   const files = req.files;

//   console.log("Backend hit with process:", process);
//   console.log("Files received:", files);

//   if (!files?.attendance?.[0] || !process) {
//     return res.status(400).json({ error: 'Missing attendance file or process selection' });
//   }

//   let connection;
//   try {
//     connection = await Pool.promise().getConnection();

//     // Parse Excel to JSON
//     const attendanceData = await parseExcel(files['attendance'][0].path);
//     console.log("Parsed Excel data:", attendanceData);

//     // Transform data
//     const transformedData = attendanceData.map(row => ({
//       emp_code: row.emp_code?.trim(),
//       emp_name: row.emp_name?.trim(),
//       attendance_records: row.attendance_records?.trim(),
//       team_leader : row.team_leader?.trim(),
//       process: process, // from req.body.tl
//       am : row.am?.trim(),
//       upload_date: new Date()
//     }));

//     console.log("Transformed data:", transformedData);

//     await connection.beginTransaction();

//     const insertOrUpdateQuery = `
//        INSERT INTO attendance (emp_code, emp_name, attendance_records, team_leader, process, am, upload_date)
// VALUES ?
// ON DUPLICATE KEY UPDATE 
//   emp_name = VALUES(emp_name),
//   attendance_records = VALUES(attendance_records),
//   team_leader = VALUES(team_leader),
//   process = VALUES(process),
//   am = VALUES(am),
//   upload_date = VALUES(upload_date);

//     `;

//     const values = transformedData.map(record => [
//       record.emp_code,
//       record.emp_name,
//       record.attendance_records,
//       record.process,
//       record.upload_date
//     ]);

//     console.log("Final values to insert:", values);

//     await connection.query(insertOrUpdateQuery, [values]);

//     await connection.commit();

//     // Cleanup uploaded file
//     const filePaths = Object.values(files).flat().map(file => file.path);
//     await cleanupFiles(filePaths);

//     return res.status(201).json({
//       message: 'Attendance records processed successfully',
//       recordsProcessed: transformedData.length
//     });

//   } catch (error) {
//     if (connection) await connection.rollback();

//     console.error('Error in UploadAttendence:', error);

//     if (files) {
//       const filePaths = Object.values(files).flat().map(file => file.path);
//       await cleanupFiles(filePaths);
//     }

//     return res.status(500).json({
//       error: 'Failed to process attendance records',
//       details: error.message
//     });

//   } finally {
//     if (connection) connection.release();
//   }
// };



const UploadAttendence = async (req, res) => {
  const { tl } = req.body;
  const process = tl;
  const files = req.files;

  if (!files?.attendance?.[0] || !process) {
    return res.status(400).json({ error: 'Missing attendance file or process selection' });
  }

  let connection;
  try {
    connection = await Pool.promise().getConnection();

    const attendanceData = await parseExcel(files['attendance'][0].path);

    const transformedData = attendanceData.map(row => ({
      emp_code: row.emp_code?.trim(),
      emp_name: row.emp_name?.trim(),
      attendance_records: row.attendance_records?.trim(),
      team_leader: row.team_leader?.trim(),
      process: process,
      am: row.am?.trim(),
      upload_date: new Date()
    }));

    await connection.beginTransaction();

    const insertOrUpdateQuery = `
      INSERT INTO attendance (emp_code, emp_name, attendance_records, team_leader, process, am, upload_date)
      VALUES ?
      ON DUPLICATE KEY UPDATE 
        emp_name = VALUES(emp_name),
        attendance_records = VALUES(attendance_records),
        team_leader = VALUES(team_leader),
        process = VALUES(process),
        am = VALUES(am),
        upload_date = VALUES(upload_date);
    `;

    const values = transformedData.map(record => [
      record.emp_code,
      record.emp_name,
      record.attendance_records,
      record.team_leader,
      record.process,
      record.am,
      record.upload_date
    ]);

    await connection.query(insertOrUpdateQuery, [values]);

    await connection.commit();

    const filePaths = Object.values(files).flat().map(file => file.path);
    await cleanupFiles(filePaths);

    return res.status(201).json({
      message: 'Attendance records processed successfully',
      recordsProcessed: transformedData.length
    });

  } catch (error) {
    if (connection) await connection.rollback();
    if (files) {
      const filePaths = Object.values(files).flat().map(file => file.path);
      await cleanupFiles(filePaths);
    }
    return res.status(500).json({
      error: 'Failed to process attendance records',
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
};




const getAttendenceData = async(req,res)=>{
  
  const {am , process} =  req.query;
  console.log("am is ",am);
  console.log("process is ",process);
   


  try {
   
    

      const [rows] = await Pool.promise().query('select * from attendance where Process = ? and AM = ?',[process,am]);
     


    
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
        
}


const getdistint = async (req, res) => {


  try {
    const [processRows] = await Pool.promise().query(
      'SELECT DISTINCT Process FROM attendance WHERE Process IS NOT NULL'
    );
    const [amRows] = await Pool.promise().query(
      'SELECT DISTINCT AM FROM attendance WHERE AM IS NOT NULL'
    );

    const processes = processRows.map(row => row.Process);
    const ams = amRows.map(row => row.AM);

    return res.status(200).json({ success: true, processes, ams });
  } catch (error) {
    console.error("Error fetching filter values:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};






const TargetFile = async (req, res) => {  
  console.log("Console log target");

  try {
    const [rowsdata] = await Pool.promise().query('SELECT Process , AM FROM agent_recovery');


    return res.status(200).json({
      success: true,
      message: "Data fetched from agent_recovery table",
      data: rowsdata
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};






const saveTargetToAgentRecovery = async (req, res) => {
  const targets = req.body;

  if (!Array.isArray(targets) || targets.length === 0) {
    return res.status(400).json({ success: false, message: "No data provided" });
  }

  try {
    for (let target of targets) {
      const { processName, amName, targetValue,  month } = target;

      if (!processName || !amName || !targetValue) {
        return res.status(400).json({ success: false, message: "Please Fill Inputs" });
      }

      // ✅ Check if this combination already exists
      const [existing] = await Pool.promise().query(
        'SELECT * FROM monthly_targets WHERE Process = ? AND AM = ? AND month = ?',
[processName, amName, month]

      );

      if (existing.length === 0) {
        // ✅ Insert only if not already present
        await Pool.promise().query(
  'INSERT INTO monthly_targets (Process, AM, Target, month) VALUES (?, ?, ?, ?)',
  [processName, amName, targetValue, month]
);

      } else {
        console.log(`Duplicate skipped: ${processName}, ${amName}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Target data saved successfully (duplicates skipped)"
    });

  } catch (error) {
    return res.status(500).json({       
      success: false,
      message: error.message
    });
  }
};






// const processTargetMap = {
//   axis_card_paid: 'credit_card',
//   axis_loan_paid: 'axis_loan',
//   axis_npa_paid: 'axis_npa',
//   city_paid: 'city_paid',
//   encore_paid: 'encore_paid',
//   iifl_paid: 'iifl_paid',
//   sbi_recovery_paid: 'sbi_recovery_paid',
// };













// const processTableMap = {
//   axis_card_paid: 'axis_card_paid',
//   axis_loan_paid: 'axis_loan_paid',
//   axis_npa_paid: 'axis_npa_paid',
//   city_paid: 'city_paid',
//   encore_paid: 'encore_paid',
//   iifl_paid: 'iifl_paid',
//   sbi_recovery_paid: 'sbi_recovery_paid',
// };

// const getStatsFromTable = async (tableName, process, startDate, endDate) => {
//   try {
//     const [[totalHeadcount]] = await Pool.promise().query(
//       `SELECT COUNT(*) AS count FROM ${tableName} 
//        WHERE DATE(datewise) BETWEEN ? AND ?`, 
//       [startDate, endDate]
//     );

//     const [[currentHeadcount]] = await Pool.promise().query(
//       `SELECT COUNT(*) AS count FROM ${tableName} 
//        WHERE DATE(datewise) BETWEEN DATE_SUB(?, INTERVAL 30 DAY) AND ?`, 
//       [endDate, endDate]
//     );

//     const [[totalMonthCollection]] = await Pool.promise().query(
//       `SELECT SUM(amount_collected) AS total FROM ${tableName} 
//        WHERE DATE(datewise) BETWEEN ? AND ?`, 
//       [startDate, endDate]
//     );

//     const [[currentMonthArchive]] = await Pool.promise().query(
//       `SELECT COUNT(*) AS count FROM ${tableName} 
//        WHERE Process IS NOT NULL AND DATE(datewise) BETWEEN ? AND ?`, 
//       [startDate, endDate]
//     );

//     const [[allocationCount]] = await Pool.promise().query(
//       `SELECT COUNT(DISTINCT account_number) AS count FROM ${tableName} 
//        WHERE DATE(datewise) BETWEEN ? AND ?`, 
//       [startDate, endDate]
//     );

//     const [[AMs]] = await Pool.promise().query(
//       `SELECT COUNT(DISTINCT am) AS count FROM ${tableName} 
//        WHERE DATE(datewise) BETWEEN ? AND ?`, 
//       [startDate, endDate]
//     );

//     const [[TLs]] = await Pool.promise().query(
//       `SELECT COUNT(DISTINCT teamleader) AS count FROM ${tableName} 
//        WHERE DATE(datewise) BETWEEN ? AND ?`, 
//       [startDate, endDate]
//     );

//     const [[targetRow]] = await Pool.promise().query(
//       `SELECT SUM(COALESCE(target, 0)) AS totalTarget FROM member 
// WHERE process_name = ? AND DATE(datewise) BETWEEN ? AND ?
// `, 
//       [process, startDate, endDate]
//     );

//     return {
//       AMs: AMs.count,
//       TLs: TLs.count,
//       stats: {
//         totalHeadcount: totalHeadcount.count,
//         currentHeadcount: currentHeadcount.count,
//         targets: `${targetRow.totalTarget || 0}`,
//         avgSalary: '65,000',
//         currentMonthArchive: currentMonthArchive.count,
//         allocationCount: allocationCount.count,
//         totalMonthCollection: `${totalMonthCollection.total || 0}`,
//       },
//     };
//   } catch (error) {
//     console.error(`Error fetching stats for ${tableName}:`, error);
//     throw error;
//   }
// };

// const getProcessReports = async (req, res) => {
//   try {
//     // Get date range from query parameters
//     let { startDate, endDate } = req.query;
    
//     // Set default to current month if not provided
//     if (!startDate || !endDate) {
//       const date = new Date();
//       startDate = new Date(date.getFullYear(), date.getMonth(), 1)
//         .toISOString().split('T')[0];
//       endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
//         .toISOString().split('T')[0];
//     }
    
//     // Validate date format (YYYY-MM-DD)
//     if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Invalid date format. Please use YYYY-MM-DD' 
//       });
//     } 

//     const results = [];

//     for (const [processName, tableName] of Object.entries(processTableMap)) {
//       const targetProcessName = processTargetMap[processName];
//       const processData = await getStatsFromTable(
//         tableName, 
//         targetProcessName, 
//         startDate, 
//         endDate
//       );
//       results.push({ name: processName, ...processData });
//     }

//     res.status(200).json(results);
//   } catch (error) {
//     console.error('Dashboard fetch error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };




// --- Mapping of table names ---
const processTableMap = {
  axis_card_paid: 'axis_card_paid',
  axis_loan_paid: 'axis_loan_paid',
  axis_npa_paid: 'axis_npa_paid',
  city_paid: 'city_paid',
  encore_paid: 'encore_paid',
  iifl_paid: 'iifl_paid',
  sbi_recovery_paid: 'sbi_recovery_paid',
};

// --- Mapping for target process names used in 'member' table ---
const processTargetMap = {
  axis_card_paid: 'axis_card',
  axis_loan_paid: 'axis_loan',
  axis_npa_paid: 'axis_npa',
  city_paid: 'city',
  encore_paid: 'encore',
  iifl_paid: 'iifl',
  sbi_recovery_paid: 'sbi_recovery',
};

// --- Function to fetch stats from a given process table ---
const getStatsFromTable = async (tableName, process, startDate, endDate) => {
  try {
   // console.log("\n========= Debug Start =========");
   // console.log("📊 Table:", tableName);
   // console.log("🎯 Process for Target:", process);
   // console.log("📅 Date Range:", startDate, "to", endDate);

    const [[totalHeadcount]] = await Pool.promise().query(
      `SELECT COUNT(*) AS count FROM ${tableName} 
       WHERE DATE(datewise) BETWEEN ? AND ?`,
      [startDate, endDate]
    );
   // console.log("✅ Total Headcount:", totalHeadcount.count);

    const [[currentHeadcount]] = await Pool.promise().query(
      `SELECT COUNT(*) AS count FROM ${tableName} 
       WHERE DATE(datewise) BETWEEN DATE_SUB(?, INTERVAL 30 DAY) AND ?`,
      [endDate, endDate]
    );
   // console.log("✅ Current Headcount:", currentHeadcount.count);

    const [[totalMonthCollection]] = await Pool.promise().query(
      `SELECT SUM(amount_collected) AS total FROM ${tableName} 
       WHERE DATE(datewise) BETWEEN ? AND ?`,
      [startDate, endDate]
    );
   // console.log("✅ Total Month Collection:", totalMonthCollection.total);

    const [[currentMonthArchive]] = await Pool.promise().query(
      `SELECT COUNT(*) AS count FROM ${tableName} 
       WHERE Process IS NOT NULL AND DATE(datewise) BETWEEN ? AND ?`,
      [startDate, endDate]
    );
   // console.log("✅ Current Month Archive:", currentMonthArchive.count);

    const [[allocationCount]] = await Pool.promise().query(
      `SELECT COUNT(DISTINCT account_number) AS count FROM ${tableName} 
       WHERE DATE(datewise) BETWEEN ? AND ?`,
      [startDate, endDate]
    );
   // console.log("✅ Allocation Count:", allocationCount.count);

    const [[AMs]] = await Pool.promise().query(
      `SELECT COUNT(DISTINCT am) AS count FROM ${tableName} 
       WHERE DATE(datewise) BETWEEN ? AND ?`,
      [startDate, endDate]
    );
    //console.log("✅ AMs:", AMs.count);

    const [[TLs]] = await Pool.promise().query(
      `SELECT COUNT(DISTINCT teamleader) AS count FROM ${tableName} 
       WHERE DATE(datewise) BETWEEN ? AND ?`,
      [startDate, endDate]
    );
  //  console.log("✅ TLs:", TLs.count);

    console.log("👉 Checking target in 'member' table for process:", process);
    const [[targetRow]] = await Pool.promise().query(
      `SELECT SUM(COALESCE(target, 0)) AS totalTarget FROM member 
       WHERE TRIM(LOWER(process_name)) = TRIM(LOWER(?)) 
       AND DATE(datewise) BETWEEN ? AND ?`,
      [process, startDate, endDate]
    );
    //console.log("🎯 Raw Target Row:", targetRow);

    //console.log("========= Debug End =========\n");

    return {
      AMs: AMs.count,
      TLs: TLs.count,
      stats: {
        totalHeadcount: totalHeadcount.count,
        currentHeadcount: currentHeadcount.count,
        targets: `${targetRow.totalTarget || 0}`,
        avgSalary: '65,000',
        currentMonthArchive: currentMonthArchive.count,
        allocationCount: allocationCount.count,
        totalMonthCollection: `${totalMonthCollection.total || 0}`,
      },
    };
  } catch (error) {
    console.error(`❌ Error fetching stats for ${tableName}:`, error);
    throw error;
  }
};

// --- Main controller to send report for all processes ---
const getProcessReports = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // If dates not provided, set to current month
    if (!startDate || !endDate) {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString().split('T')[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString().split('T')[0];
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD',
      });
    }

    const results = [];

    for (const [processName, tableName] of Object.entries(processTableMap)) {
      const targetProcessName = processTargetMap[processName];
      console.log(`🔥 Mapping [${processName}] => Target Process: ${targetProcessName}`);

      const processData = await getStatsFromTable(
        tableName,
        targetProcessName,
        startDate,
        endDate
      );

      results.push({ name: processName, ...processData });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Dashboard fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};












function excelSerialDateToISO(serial) {
  const excelStartDate = new Date(1899, 11, 30); // Excel starts from 1899-12-30
  const date = new Date(excelStartDate.getTime() + serial * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0]; // returns 'YYYY-MM-DD'
}

const UploadTargetFile = async (req, res) => {
  console.log("Called UploadTargetFile");

  const mapdatabase = {
    axis_loan: 'axis_loan_paid',
    axis_npa: 'axis_npa_paid',
    axis_card: 'axis_card_paid',
    city_paid: 'city_paid',
    encore_paid: 'encore_paid',
    iifl_paid: 'iifl_paid',
    sbi_recovery_paid: 'sbi_recovery_paid'
  };

  const process = req.body.Process;
  const tablename = mapdatabase[process];

  console.log("Table is ",tablename);

  if (!tablename) {
    return res.status(400).json({ error: 'Invalid process type' });
  }

  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = req.file.path;

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const values = data.map(item => [
      excelSerialDateToISO(item.date),
      item.agent_code,
      item.agent_name,
      item.amount_collected,
      item.account_number,
      item.am,
      process,
      item.teamleader
    ]);



    const query = `INSERT INTO ${tablename} (datewise, agent_code, agent_name, amount_collected, account_number, AM, Process, TeamLeader) VALUES ?`;

    const [rows] = await Pool.promise().query(query, [values]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "File is not uploaded" });
    }

    return res.status(201).json({ success: true, message: "File uploaded successfully" });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  } finally {
    // Delete the uploaded file
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete uploaded file:", err);
        } else {
          console.log("Uploaded file removed:", filePath);
        }
      });
    }
  }
};





    












const esaudata = async (req, res) => {
  console.log("cAll data")
  try {
    const { process, startDate, endDate } = req.query;

    const tableMap = {
      axis_loan: 'axis_loan_paid',
      axis_npa: 'axis_npa_paid',
      axis_card: 'axis_card_paid',
      city_paid: 'city_paid',
      encore_paid: 'encore_paid',
      iifl_paid: 'iifl_paid',
      sbi_recovery_paid: 'sbi_recovery_paid'
    };

    const tableName = tableMap[process];

    if (!tableName || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing process or date range' });
    }

    // Step 1: Fetch collection entries
    const [collections] = await Pool.promise().query(
      `SELECT agent_code, agent_name, am, process, teamleader, amount_collected, datewise 
       FROM ${tableName} 
       WHERE datewise BETWEEN ? AND ?`,
      [startDate, endDate]
    );

    // Step 2: Group by agent_code
    const groupedCollections = {};

    for (const row of collections) {
      const agent_code = row.agent_code || 'Unknown_Code';
      const emp_name = row.agent_name || 'Unknown_Name';
      const am = row.am || 'Unknown_AM';
      const teamleader = row.teamleader || 'Unknown_TL';
      const proc = row.process || 'Unknown_Process';
      const amount = parseFloat(row.amount_collected) || 0;
      const date = moment(row.datewise).format('YYYY-MM-DD');

      if (!groupedCollections[agent_code]) {
        groupedCollections[agent_code] = {
          agent_code,
          emp_name,
          am,
          teamleader,
          process: proc,
          total_collected: amount,
          dates: [date]
        };
      } else {
        groupedCollections[agent_code].total_collected += amount;
        groupedCollections[agent_code].dates.push(date);
      }
    }

    // Step 3: Fetch targets safely
    const empCodes = Object.keys(groupedCollections);

    let targets = [];
    if (empCodes.length > 0) {
      [targets] = await Pool.promise().query(
        `SELECT agent_code, target 
         FROM member 
         WHERE process_name = ? AND agent_code IN (${empCodes.map(() => '?').join(',')})`,
        [process, ...empCodes]
      );
    }

    const targetMap = {};
    for (const t of targets) {
      targetMap[t.agent_code] = parseFloat(t.target) || 0;
    }

    // Step 4: Build result
    const result = Object.values(groupedCollections).map(emp => {
      const target = targetMap[emp.agent_code] || 0;
      const rest = target - emp.total_collected;
      const percentageValue = target > 0 ? (emp.total_collected / target) * 100 : 0;
      const percentage = percentageValue.toFixed(2);

      let esau_status = 'U';
      if (percentageValue > 100) esau_status = 'O';
      else if (percentageValue >= 90) esau_status = 'E';
      else if (percentageValue >= 70) esau_status = 'A';
      else if (percentageValue >= 50) esau_status = 'S';

      return {
        agent_code: emp.agent_code,
        emp_name: emp.emp_name,
        am: emp.am,
        teamleader: emp.teamleader,
        process: emp.process,
        target,
        total_collected: emp.total_collected,
        rest,
        percentage: `${percentage}%`,
        esau_status,
        dates: emp.dates
      };
    });

    return res.status(200).json({ success: true, data: result });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




// const TargetAgentWise = async (req, res) => {
//   console.log("call target");

//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const filePath = req.file.path;

//     // Read Excel file
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     if (jsonData.length === 0) {
//       return res.status(400).json({ error: 'Excel file is empty' });
//     }

//     const { month, year } = req.body;
//     if (!month || !year) {
//       return res.status(400).json({ error: 'Month and year required' });
//     }

//     const datewise = moment(`${year}-${month}-01`, 'YYYY-MMMM-DD', true);
//     if (!datewise.isValid()) {
//       return res.status(400).json({ error: 'Invalid month or year format' });
//     }

//     const formattedDate = datewise.format('YYYY-MM-DD');

//     // Clean headers in case of unexpected spaces
//     const cleanedData = jsonData.map(row => ({
//       process_name: row['process_name'] || row[' process_name'] || row['Process Name'] || '',
//       agent_code : row['agent_code'],
//       agent: row['agent'] || '',
//       target: parseFloat(row['target']) || 0
//     }));

//     const values = cleanedData.map(row => ([
//       row.process_name,
//       row.agent,
//       row.target,
//       row.agent_code,
//       new Date(),       // CreatedAt
//       formattedDate     // datewise
//     ]));

//     const sql = `
//       INSERT INTO member 
//       (process_name, agent, target, agent_code, CreatedAt, datewise)
//       VALUES ?
//     `;

//     // Use Pool directly — no .release() needed
//     await Pool.promise().query(sql, [values]);

//    await fs.unlink(filePath);


//     res.status(200).json({ message: 'Data inserted successfully', count: values.length });

//   } catch (err) {
//     console.error('Upload Error:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };



const TargetAgentWise = async (req, res) => {
  console.log("call target");

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
      
    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (jsonData.length === 0) {
      return res.status(400).json({ error: 'Excel file is empty' });
    }

    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const datewise = moment(`${year}-${month}-01`, 'YYYY-MMMM-DD', true);
    if (!datewise.isValid()) {
      return res.status(400).json({ error: 'Invalid month or year format' });
    }

    const formattedDate = datewise.format('YYYY-MM-DD');

    // Clean and format data
    const cleanedData = jsonData.map(row => ({
      process_name: row['process_name']?.trim() || row[' process_name']?.trim() || row['Process Name']?.trim() || '',
      agent_code: row['agent_code']?.trim() || '',
      agent: row['agent']?.trim() || '',
      target: parseFloat(row['target']) || 0
    }));

    const values = cleanedData.map(row => ([
      row.process_name,
      row.agent,
      row.target,
      row.agent_code,
      new Date(),       // CreatedAt
      formattedDate     // datewise
    ]));

    const sql = `
      INSERT INTO member 
      (process_name, agent, target, agent_code, CreatedAt, datewise)
      VALUES ?
    `;

    await Pool.promise().query(sql, [values]);
    await fs.unlink(filePath); // delete uploaded file after processing

    res.status(200).json({
      message: 'Data inserted successfully',
      count: values.length
    });

  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






module.exports = {UserLogin , UserSignup , verifyOtp , Logout , GetUser , UploadAttendence , getAttendenceData , getdistint , TargetFile , saveTargetToAgentRecovery , getProcessReports  , UploadTargetFile , esaudata , TargetAgentWise };














