const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const eventObj = JSON.parse(event.body);
    const userId = eventObj.userId;
    const startDate = eventObj.startDate;
    const endDate = eventObj.endDate;
    const baseSalary = 300; // Adjust this value as needed

    // Calculate the number of days in the current month
  const daysInMonth = new Date( new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0).getDate();

  // Calculate daily base salary
  console.log('Days in month:', daysInMonth);
  const dailyBaseSalary = Math.ceil(baseSalary / daysInMonth);
  console.log('Daily base salary:', dailyBaseSalary);

  // Calculate days between startDate and endDate
  const daysBetween = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
  console.log('Days between:', daysBetween);

  // Calculate total base salary for the selected date range
  const totalBaseSalary = dailyBaseSalary * daysBetween;
  console.log('Total base salary:', totalBaseSalary);

  const params = {
    TableName: 'Post-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
    IndexName: 'UserIdStatusIndex',
    KeyConditionExpression: 'userID = :userID and #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status'
    },
    ExpressionAttributeValues: {
      ':userID': userId,
      ':status': 'APPROVED',
      
    }
  };

  try {
    const result = await dynamoDB.query(params).promise();
    const allHomes = result.Items;
    console.log('All homes:', allHomes);

    const homes = allHomes.filter(
      (home) => home.createdAt >= startDate && home.createdAt <= endDate,
    );

    console.log('Homes:', homes);

    let totalSalary = 0;
    const categories = {
      available: 0,
      unavailable: 0,
    };

    homes.forEach((home) => {
      const createdAt = new Date(home.createdAt);
      const availability = home.available;

      // Calculate the salary and update the categories count
      let salary = 0;
      if (availability === 'No') {
        const daysUntilAvailable = Math.ceil(
          (new Date(home.availabilityDate) - createdAt) /
            (1000 * 60 * 60 * 24),
        );
        if (daysUntilAvailable <= 30) {
          salary = 5;
        }
        categories.unavailable += 1;
      } else {
        salary = 10;
        categories.available += 1;
      }

      totalSalary += salary;
    });

    console.log('Total salary:', totalSalary);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        totalSalary: totalSalary + totalBaseSalary,
        baseSalary: totalBaseSalary,
        numberOfHomes: homes.length,
        categories: categories,
      }),
    };
    return response;

  } catch (error) {
    console.error(error);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error calculating salary' }),
    };
    return response;
  }
};
