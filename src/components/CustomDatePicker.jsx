// import React, { useState } from 'react';
// import { Controller } from 'react-hook-form';
// import { View, Button, Platform } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const CustomDatePicker = ({
//     control,
//     name,
//     rules = {},
//     styleContainer = {},
//     ...rest
// }) => {
//     const [date, setDate] = useState(new Date());
//     const [show, setShow] = useState(false);

//     const onChange = (event, selectedDate) => {
//         const currentDate = selectedDate || date;
//         setShow(Platform.OS === 'ios');
//         setDate(currentDate);
//         // Call the method provided by react-hook-form
//         rest.onChange(currentDate);
//     };

//     return (
//         <Controller
//             control={control}
//             name={name}
//             rules={rules}
//             render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
//                 <View style={[styleContainer]}>
//                     <Button onPress={() => setShow(true)} title="Show date picker!" />
//                     {show && (
//                         <DateTimePicker
//                             testID="dateTimePicker"
//                             value={value || date}
//                             mode="date"
//                             display="default"
//                             onChange={onChange}
//                             {...rest}
//                         />
//                     )}
//                     {/* Display error message if there's an error */}
//                 </View>
//             )}
//         />
//     );
// };

// export default CustomDatePicker;
