var ExifImage = require('exif').ExifImage;
const fs = require('fs');
const folder = '/Users/jostung/Documents/Elaine Backup/Photo Backup/';
const destination = '/Users/jostung/Documents/Elaine Backup/Backup/';
const others = 'Others';
const otherFolder = '/Users/jostung/Documents/Elaine Backup/Backup/Others'
try {
    
    // fs.readdir(otherFolder, (err, files) => {
    //     if (files) {
    //         files.forEach(file => {
    //             var filePath = otherFolder + "/" + file;
    //             new ExifImage({
    //                 image: filePath
    //             }, function (error, exifData) {
    //                 if (error) {
    //                     console.log(file);
    //                     console.log('Error: ' + error.message);
    //                 } else {
    //                     console.log(file);
    //                     console.log(exifData.exif.CreateDate);
    //                     console.log(exifData.exif.DateTimeOriginal);
    //                     console.log(exifData.image.ModifyDate);
    //                 }
    //             });
    //         });
    //     }
    // });

    // fs.readdir(folder, (err, folders) => {
    //     folders.forEach(subFolder => {
    //         var folderPath = folder + subFolder;
    //         fs.readdir(folderPath, (err, files) => {
    //             if (files) {
    //                 files.forEach(file => {
    //                     var filePath = folderPath + "/" + file;
    //                     readInformation(file, filePath);
    //                 });
    //             }
    //         });
            
    //     });
    // });

    fs.readdir(folder, (err, folders) => {
        folders.forEach(subFolder => {
            var folderPath = folder + subFolder;
            var yearPattern = RegExp(/\d{4}年/g);
            var monthPattern = RegExp(/\d{1,2}月/g);
            
            if (subFolder.match(yearPattern) && subFolder.match(monthPattern)) {
                var year = subFolder.match(yearPattern)[0].replace('年', '');
                var month = String(subFolder.match(monthPattern)[0].replace('月', '')).padStart(2, '0');
                var destFolder = year + month;

                fs.readdir(folderPath, (err, files) => {
                    if (files) {
                        files.forEach(file => {
                            var filePath = folderPath + "/" + file;
                            movePhoto(destFolder, filePath, file);  
                        });
                    }
                });
            }
            
            // if (subFolder.match(pattern)) {
                
            //     //console.log(subFolder.match(pattern)[0]);
            //     console.log(subFolder.match(pattern));
            //     //console.log(subFolder.match(pattern)[1]);
            //     //console.log(subFolder.match(pattern)[2]);
            // }

        });
    });

    

    
} catch (error) {
    console.log('Error: ' + error.message);
}

function readInformation(filename, filePath) {
    new ExifImage({
        image: filePath
    }, function (error, exifData) {
        if (error){
            movePhoto(others, filePath, filename);  
            console.log('Error: ' + error.message);
        } else {
            if (exifData.exif.CreateDate) {
                var reg = RegExp(/\d{4}:\d{2}:\d{2}/g);
                var date = exifData.exif.CreateDate.match(reg)[0].replace(/:/g, '-');
                var createdDate = new Date(date);
                var folder = createdDate.getFullYear() + String(createdDate.getMonth() + 1).padStart(2, '0');
                movePhoto(folder, filePath, filename);  
            } else {
                movePhoto(others, filePath, filename);  
            }
        }
    });
}

function movePhoto(destFolderName, sourceFilePath, filename) {
    var folderPath = destination + destFolderName;
    if (!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath);
        console.log('create folder', folderPath);
    }

    var destFilePath = folderPath + "/" + filename;
    //fs.copyFileSync(sourceFilePath, destFilePath);
    fs.renameSync(sourceFilePath, destFilePath);
    console.log('move file successfully', destFilePath);
}