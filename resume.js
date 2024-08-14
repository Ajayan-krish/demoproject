const xlsx = require('xlsx');

module.exports = {
    'Extract and Compare Resume Data': function(browser){
        const email = 'test@test.com';
        const password = 'Qwerty@123';
        let extractedData = {};

        // Navigate and extract data (same as your current code)
        browser
            .url('https://demo.lcp.neartekpod.io/')
            .maximizeWindow()
            .useXpath()
            .setValue('//*[@id="username"]', email).pause(2000)
            .setValue('//*[@id="password"]', password)
            .click("//button[text()='Continue']")
            .click("//a[text()='Hiring']")
            .click("//a[text()='Job Description']")
            .click("(//span[@class='text-sm font-medium'])[1]").pause(5000)
            .click("//button[text()='Candidate']").pause(2000)
            .saveScreenshot('C:/Users/ajaya/Documents/NightWatch/Lcp_Demo/Screenshots/Before-cad.png')
            .click("//a[text()='Add New']").pause(2000)
            .click("//label[@for='file']").pause(10000)
            
            .getValue("//input[@placeholder='Application Date']", function(result) {
                extractedData.applicationDate = result.value;
            }).pause(2000)
            .getValue("//input[@placeholder='Enter Your Name']", function(result) {
                extractedData.name = result.value;
            }).pause(2000)
            .getValue("//input[@placeholder='Enter Your Email']", function(result) {
                extractedData.email = result.value;
            }).pause(2000)
            .getValue("//input[@placeholder='Enter Your Phone']", function(result) {
                extractedData.phone = result.value;
            }).pause(2000)
            .getValue("//input[@placeholder='Enter Your Experience']", function(result) {
                extractedData.experience = result.value;
            }).pause(2000)
            .perform(function() {
                // Store the extracted data in an Excel file
                const workbook = xlsx.utils.book_new();
                const worksheet = xlsx.utils.json_to_sheet([extractedData]);
                xlsx.utils.book_append_sheet(workbook, worksheet, 'Resume Data');
                xlsx.writeFile(workbook, 'extracted_data.xlsx');

                console.log('Data saved to extracted_data.xlsx');
            })

            // Compare with original data
            .perform(function() {
                // Load both Excel files
                const extractedWorkbook = xlsx.readFile('extracted_data.xlsx');
                const originalWorkbook = xlsx.readFile('original_data.xlsx');

                const extractedSheet = extractedWorkbook.Sheets[extractedWorkbook.SheetNames[0]];
                const originalSheet = originalWorkbook.Sheets[originalWorkbook.SheetNames[0]];

                const extractedData = xlsx.utils.sheet_to_json(extractedSheet)[0];
                const originalData = xlsx.utils.sheet_to_json(originalSheet)[0];

                let matchCount = 0;
                let totalFields = 0;

                // Compare each field
                for (let key in originalData) {
                    totalFields++;
                    if (extractedData[key] === originalData[key]) {
                        matchCount++;
                        console.log(`Field "${key}" matches: ${extractedData[key]}`);
                    } else {
                        console.log(`Field "${key}" does not match. Extracted: ${extractedData[key]}, Original: ${originalData[key]}`);
                    }
                }

                // Calculate similarity percentage
                const similarityPercentage = (matchCount / totalFields) * 100;
                console.log(`Similarity Percentage: ${similarityPercentage.toFixed(2)}%`);
            })
            .end();
    }
};
