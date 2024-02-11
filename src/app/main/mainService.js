// import moment from "moment-timezone";
//
// /** 한국 시간 가져오는 함수 moment-timezone lib 사용 */
// export const getCurrentTime = () => {
//     var m = moment().tz("Asia/Seoul");
//     return m.format("YYYY-MM-DD HH:mm:ss");
// };
//
// /** date를 년, 월, 일, 시간, 분, 초로 slice */
// export const sliceTime = (date) => {
//         const dateObj = new Date(date);
//         const year = dateObj.getFullYear();
//         const month = dateObj.getMonth() + 1;
//         const day = dateObj.getDate();
//         const hours = dateObj.getHours();
//         const minutes = dateObj.getMinutes();
//         const seconds = dateObj.getSeconds();
//
//         return { year, month, day, hours, minutes, seconds };
// }
//
// /** 현재 시간과 마감 시간 비교하여 남은 마감시간 return */
// export const calculateTime = (currentTime, endTime) => {
//     const year = endTime.year - currentTime.year;
//     const month = endTime.month - currentTime.month;
//     const day = endTime.day - currentTime.day;
//     const hours = endTime.hours - currentTime.hours;
//     const minutes = endTime.minutes - currentTime.minutes;
//     const seconds = endTime.seconds - currentTime.seconds;
//
//     if (year > 0) {
//         return { message : "D-DAY " + year + "년"};
//     }
//     else if(month > 0) {
//         return { message : "D-DAY " + month + "개월"};
//     }
//     else if (day > 0) {
//         return { message : "D-DAY " + day + "일"};
//     }
//     else if (hours > 0) {
//         return { message : hours + "시간 후 마감"};
//     }
//     else if (minutes > 0) {
//         return { message : minutes + "분 후 마감"};
//     }
//     else if (seconds > 0) {
//         return { message : seconds + "초 후 마감"};
//     }
//     return { message : "마감"};
// }
//
// /** isMyPost 내가 작성한 post인지*/
// export const isMyPost = (postPage, currentUserId) => {
//     postPage.forEach(element => {
//         if (element.user_id == currentUserId) {
//
//             element['isMyPost'] = true;
//         }
//         else {
//             element['isMyPost'] = false;
//         }
//     });
//     return postPage;
// }
//
// /** due-date 계산 */
// export const addDueDate = (postPage, currentTime) => {
//     postPage.forEach(element => {
//         const endTime = sliceTime(element.end_date);
//         const calculateTimeResult = calculateTime(currentTime, endTime);
//         element['due-date'] = calculateTimeResult.message;
//     });
// }