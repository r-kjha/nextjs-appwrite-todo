"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  CheckIcon, 
  XIcon, 
  PlusIcon, 
  TrashIcon,
  ClockIcon,
  CheckCircleIcon 
} from "lucide-react";
import TodoService from "@/lib/todos";

const todoSchema = z.object({
  title: z
    .string()
    .min(1, "Todo title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export function TodoManager({ userId }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, [userId]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const result = await TodoService.getTodos(userId);
      setTodos(result.documents || []);
    } catch (error) {
      console.error('Error loading todos:', error);
      setError("Failed to load todos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (data) => {
    try {
      setSubmitting(true);
      setError("");
      
      const newTodo = await TodoService.createTodo(
        userId,
        data.title,
        data.description
      );
      
      setTodos(prev => [newTodo, ...prev]);
      form.reset();
    } catch (error) {
      console.error('Error creating todo:', error);
      setError("Failed to create todo. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      await TodoService.deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.$id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const updatedTodo = await TodoService.toggleTodo(todo.$id, todo.completed);
      setTodos(prev =>
        prev.map(t => t.$id === todo.$id ? updatedTodo : t)
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError("Failed to update todo. Please try again.");
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading todos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircleIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Todo List
        </h3>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Add Todo Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h4 className="text-lg font-medium mb-4">Add New Todo</h4>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(createTodo)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What needs to be done?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add more details..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Todo
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {pendingTodos.length}
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-600">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {completedTodos.length}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {todos.length}
          </p>
        </div>
      </div>

      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-orange-500" />
            Pending Tasks ({pendingTodos.length})
          </h4>
          
          <div className="space-y-3">
            {pendingTodos.map((todo) => (
              <div
                key={todo.$id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => toggleTodo(todo)}
                    className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 hover:border-green-500 transition-colors"
                  >
                    {todo.completed && (
                      <CheckIcon className="h-3 w-3 text-green-500 m-0.5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {todo.title}
                    </h5>
                    {todo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {todo.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {new Date(todo.$createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.$id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
            Completed Tasks ({completedTodos.length})
          </h4>
          
          <div className="space-y-3">
            {completedTodos.map((todo) => (
              <div
                key={todo.$id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-green-50 dark:bg-green-900/10"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => toggleTodo(todo)}
                    className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    <CheckIcon className="h-3 w-3 text-white" />
                  </button>
                  
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white line-through opacity-75">
                      {todo.title}
                    </h5>
                    {todo.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-through opacity-75">
                        {todo.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Completed: {new Date(todo.$updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.$id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {todos.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No todos yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first todo to get started!
          </p>
        </div>
      )}
    </div>
  );
}
