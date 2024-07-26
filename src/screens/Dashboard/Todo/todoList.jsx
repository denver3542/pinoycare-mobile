import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Text, Chip, Appbar, Button, FAB, Portal, Dialog } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format, startOfDay } from 'date-fns';
import moment from 'moment';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import TodoAdd from './todoAdd';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTodo, useUpdateTodo } from './hooks/useTodo';

const mapStatusToDisplayName = (status) => {
    switch (status) {
        case 'todo':
            return 'To Do';
        case 'incomplete':
            return 'In Progress';
        case 'complete':
            return 'Completed';
        default:
            return 'All';
    }
};

const getChipStyle = (status) => {
    switch (status) {
        case 'todo':
            return {
                backgroundColor: '#E3F2FF',
                color: '#5690FD',
            };
        case 'incomplete':
            return {
                backgroundColor: '#FFE9E1',
                color: '#FF7D53',
            };
        case 'complete':
            return {
                backgroundColor: '#BEFFB4',
                color: '#159500',
            };
        default:
            return {
                backgroundColor: '#e0e0e0',
                color: '#000',
            };
    }
};

const TodoList = () => {
    const navigation = useNavigation();
    const { data, refetch, isLoading, error, deleteTodo } = useTodo();
    const { mutate: updateTodo } = useUpdateTodo();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedTask, setSelectedTask] = useState(null);
    const [visible, setVisible] = useState(false);
    const [addTodoVisible, setAddTodoVisible] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateFieldName, setDateFieldName] = useState(null);

    const updateBottomSheetRef = useRef(null);
    const addTodoBottomSheetRef = useRef(null);

    const { control, handleSubmit, setValue, reset } = useForm();

    const snapPoints = useMemo(() => ['60%'], []);
    const addTodoSnapPoints = useMemo(() => ['55%'], []);

    const handleCloseBottomSheet = () => { updateBottomSheetRef.current?.close(); };
    const handleOpenBottomSheet = (task) => {
        setSelectedTask(task);
        setValue('title', task.title);
        setValue('description', task.description);
        setValue('start_time', moment(task.start_time).format('MMMM D, YYYY h:mm A'));
        setValue('end_time', moment(task.end_time).format('MMMM D, YYYY h:mm A'));
        setValue('start_time_iso', task.start_time);
        setValue('end_time_iso', task.end_time);
        Keyboard.dismiss();
        setTimeout(() => updateBottomSheetRef.current?.expand(), 300);
    };

    const handleOpenAddTodoBottomSheet = () => {
        setAddTodoVisible(true);
        Keyboard.dismiss();
        setTimeout(() => addTodoBottomSheetRef.current?.expand(), 300);
    };

    const renderBackdrop = useCallback(
        (props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
        []
    );

    const formatDateForSubmission = (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return '';
        }
        return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
    };

    const handleUpdate = async (formData) => {
        const formattedData = {
            ...formData,
            start_time: formatDateForSubmission(new Date(formData.start_time_iso)),
            end_time: formatDateForSubmission(new Date(formData.end_time_iso)),
        };
        await updateTodo({
            ...formattedData,
            id: selectedTask.id,
        });
        handleCloseBottomSheet();
    };



    const handleDelete = async () => {
        await deleteTodo(selectedTask.id);
        setVisible(false);
    };

    const showDeleteDialog = () => setVisible(true);
    const hideDeleteDialog = () => setVisible(false);

    const showDatePicker = (fieldName) => {
        setDateFieldName(fieldName);
        setDatePickerVisibility(true);
    };


    const handleConfirm = (date) => {
        setDatePickerVisibility(false);

        if (!(date instanceof Date) || isNaN(date.getTime())) {
            alert("Invalid date selected.");
            return;
        }

        const formattedForDisplay = moment(date).format('MMMM D, YYYY h:mm A');
        setValue(dateFieldName, formattedForDisplay);
        setValue(`${dateFieldName}_iso`, date.toISOString());
    };

    const filterTasks = (tasks) => {
        if (selectedStatus !== 'all') {
            tasks = tasks.filter(task => task.status === selectedStatus);
        }

        if (selectedDate) {
            const selectedDateObject = startOfDay(new Date(selectedDate));
            tasks = tasks.filter(task => {
                const taskDate = startOfDay(new Date(task.start_time));
                return taskDate.getTime() === selectedDateObject.getTime();
            });
        }

        return tasks;
    };

    const currentDate = new Date();
    const isCurrentDate = (date) => {
        return startOfDay(date).getTime() === startOfDay(currentDate).getTime();
    };
    return (
        <View style={{ flex: 1 }}>
            <Spinner visible={isLoading} />
            <Appbar.Header style={{ backgroundColor: '#0A3480' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title={`Today, ${format(new Date(), 'MMM dd')}`} color="white" />
            </Appbar.Header>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.containerWrapper}>
                    <View style={styles.calendarContainer}>
                        <Calendar
                            onDayPress={(day) => setSelectedDate(day.dateString)}
                            markedDates={{ [selectedDate]: { selected: true, selectedColor: '#0A3480' } }}
                            markingType={'simple'}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={styles.chipContainer}>
                            {['all', 'todo', 'incomplete', 'complete'].map((status) => (
                                <Chip
                                    key={status}
                                    selected={selectedStatus === status}
                                    onPress={() => setSelectedStatus(status)}
                                    style={[
                                        styles.chip,
                                        selectedStatus === status && styles.selectedChip
                                    ]}
                                    textStyle={[
                                        styles.chipText,
                                        selectedStatus === status && styles.selectedChipText
                                    ]}
                                    selectedColor="#fff"
                                    mode={selectedStatus === status ? 'flat' : 'outlined'}
                                >
                                    {mapStatusToDisplayName(status)}
                                </Chip>
                            ))}
                        </View>
                        {data && data.tasks && data.tasks.length > 0 ? (
                            filterTasks(data.tasks).map((task) => (
                                <TouchableHighlight
                                    key={task.id}
                                    onLongPress={() => handleOpenBottomSheet(task)}
                                    style={[styles.card, { borderRadius: 14 }]}
                                >
                                    <View style={styles.cardContent}>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                            <Text style={styles.title}>{task.title}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                                <Text style={styles.time}>{moment(task.start_time).format('h:mm a')} - {moment(task.end_time).format('h:mm a')}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.category}>{task.description}</Text>
                                            <View style={styles.timeStatusContainer}>
                                                <Chip textStyle={{
                                                    minHeight: 15,
                                                    lineHeight: 15,
                                                    marginRight: 15,
                                                    marginLeft: 15,
                                                    marginVertical: 4,
                                                    fontSize: 12,
                                                    color: getChipStyle(task.status).color,
                                                }} style={{
                                                    fontSize: 12,
                                                    borderRadius: 6,
                                                    backgroundColor: getChipStyle(task.status).backgroundColor,
                                                }}>
                                                    {mapStatusToDisplayName(task.status)}
                                                </Chip>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            ))
                        ) : (
                            <Text style={styles.noTasksText}>No tasks available</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.fabContainer}>
                <FAB
                    style={styles.fab}
                    icon="plus"
                    color="white"
                    onPress={handleOpenAddTodoBottomSheet}
                />
            </View>

            <BottomSheet
                ref={updateBottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
            >
                <BottomSheetView style={styles.bottomSheetContent}>
                    {selectedTask && (
                        <>
                            <View style={styles.bottomSheetHeader}>
                                <Text style={styles.bottomSheetTitle}>{selectedTask.title}</Text>
                            </View>

                            <Controller
                                control={control}
                                name="title"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="Title"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        mode="outlined"
                                        style={styles.input}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="description"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        label="Description"
                                        value={value}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        mode="outlined"
                                        style={styles.input}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="start_time"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TouchableOpacity onPress={() => showDatePicker('start_time')}>
                                        <TextInput
                                            label="Start Time"
                                            mode="outlined"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.input}
                                            editable={false}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                            <Controller
                                control={control}
                                name="end_time"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TouchableOpacity onPress={() => showDatePicker('end_time')}>
                                        <TextInput
                                            label="End Time"
                                            mode="outlined"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            style={styles.input}
                                            editable={false}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                            <View style={{ gap: 10 }}>
                                <Button mode="contained" onPress={handleSubmit(handleUpdate)}>
                                    Update Task
                                </Button>
                                <Button mode="outlined" onPress={showDeleteDialog}>
                                    Delete
                                </Button>
                            </View>
                        </>
                    )}
                </BottomSheetView>
            </BottomSheet>

            <BottomSheet
                ref={addTodoBottomSheetRef}
                index={-1}
                snapPoints={addTodoSnapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
            >
                <TodoAdd onClose={() => addTodoBottomSheetRef.current?.close()} />
            </BottomSheet>

            <Portal>
                <Dialog visible={visible} onDismiss={hideDeleteDialog}>
                    <Dialog.Title>Delete Task</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this task?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDeleteDialog}>Cancel</Button>
                        <Button onPress={handleDelete}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={() => setDatePickerVisibility(false)}
                minimumDate={dateFieldName === 'end_time' && selectedTask ? new Date(selectedTask.start_time) : undefined}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },
    containerWrapper: {
        flex: 1,
    },
    calendarContainer: {
        padding: 10,
        backgroundColor: 'white',
        // elevation: 1,
        marginBottom: 10
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    chip: {
        backgroundColor: '#e0e0e0',
        borderWidth: 0,
        elevation: 1,
    },
    selectedChip: {
        backgroundColor: '#0A3480',
    },
    chipText: {
        color: '#000',
        fontSize: 12
    },
    selectedChipText: {
        color: '#fff',
        fontSize: 12
    },
    card: {
        marginVertical: 4,
    },
    cardContent: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 14,
        borderColor: '#ddd',
        borderWidth: 0.5,
    },
    category: {
        fontSize: 14,
        color: '#757575',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    timeStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    time: {
        fontSize: 14,
        color: '#757575',
    },
    noTasksText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#757575',
        marginVertical: 20,
    },
    bottomSheetContent: {
        flex: 1,
        padding: 16,
    },
    bottomSheetHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
        marginBottom: 16,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bottomSheetTime: {
        fontSize: 16,
        color: '#757575',
    },
    bottomSheetBody: {
        flex: 1,
    },
    bottomSheetDescription: {
        fontSize: 16,
        marginBottom: 16,
    },
    bottomSheetNotes: {
        marginBottom: 16,
    },
    bottomSheetNotesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    bottomSheetNote: {
        fontSize: 16,
        marginBottom: 4,
    },
    bottomSheetActions: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    fabContainer: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fab: {
        backgroundColor: '#0A3480',
        borderRadius: 50,
    },
    input: {
        marginBottom: 16,
    },
});

export default TodoList;
