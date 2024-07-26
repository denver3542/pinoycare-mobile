import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../../utils/axiosConfig";
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

async function getTodoData() {
    try {
        const storedUser = await AsyncStorage.getItem("upcare_user");
        const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
        const { data } = await axiosInstance.get('/user/todo/index', {
            headers,
            "Content-Type": "application/json;charset=utf-8",
        });
        return data;
    } catch (error) {
        console.error("Error fetching todo data:", error.response || error.message || error);
    }
}

const deleteTodo = async (todoId) => {
    try {
        const storedUser = await AsyncStorage.getItem("upcare_user");
        const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
        const response = await axiosInstance.delete('/user/todo/delete', {
            headers,
            data: { task_id: todoId }
        });
        if (response.status !== 200) {
            throw new Error('Failed to delete todo');
        }
        return todoId;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const useTodo = () => {
    const queryClient = useQueryClient();
    const todoQuery = useQuery(["todo"], getTodoData);
    const [deleteError, setDeleteError] = useState(null);

    const deleteMutation = useMutation(
        (todoId) => deleteTodo(todoId),
        {
            onMutate: async (todoId) => {
                await queryClient.cancelQueries(['todo']);
                const previousData = queryClient.getQueryData(['todo']);

                queryClient.setQueryData(['todo'], (old) => {
                    if (!old || !Array.isArray(old.data)) return old;
                    return {
                        ...old,
                        data: old.data.filter(todo => todo.id !== todoId),
                    };
                });

                return { previousData };
            },
            onError: (err, variables, context) => {
                setDeleteError(err.message);
                queryClient.setQueryData(['todo'], context.previousData);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(['todo']);
            }
        }
    );

    return {
        ...todoQuery,
        deleteTodo: deleteMutation.mutate,
        deleteError,
    };
};

export async function addTodoData(newTask) {
    try {
        const storedUser = await AsyncStorage.getItem("upcare_user");
        const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
        const response = await axiosInstance.post('/user/todo/store', newTask, { headers });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error adding todo:");
            console.error("Status code:", error.response.status);
            console.error("Response data:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else {
            console.error("Error adding todo:", error.message);
        }
        throw new Error("Error adding todo");
    }
}

export function useAddTodoData() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        (newTask) => addTodoData(newTask),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["user"]);
                queryClient.invalidateQueries("tasks");
                navigation.goBack();
            },
            onError: (error) => {
                console.error("Failed to submit todo:", error);
            },
        }
    );
}

const updateTodo = async (updatedTask) => {
    try {
        const storedUser = await AsyncStorage.getItem("upcare_user");
        const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
        const response = await axiosInstance.post('/user/todo/update', updatedTask, { headers });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error updating todo:");
            console.error("Status code:", error.response.status);
            console.error("Response data:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else {
            console.error("Error updating todo:", error.message);
        }
        throw new Error("Error updating todo");
    }
};

export function useUpdateTodo() {
    const queryClient = useQueryClient();
    const navigation = useNavigation();

    return useMutation(
        (updatedTask) => updateTodo(updatedTask),
        {
            onMutate: async (updatedTask) => {
                await queryClient.cancelQueries(['todo']);
                const previousData = queryClient.getQueryData(['todo']);

                queryClient.setQueryData(['todo'], (old) => {
                    if (!old || !Array.isArray(old.data)) return old;
                    return {
                        ...old,
                        data: old.data.map(task => task.id === updatedTask.id ? updatedTask : task),
                    };
                });

                return { previousData };
            },
            onError: (err, variables, context) => {
                console.error("Failed to update todo:", err.message);
                queryClient.setQueryData(['todo'], context.previousData);
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["todo"]);
            }
        }
    );
}