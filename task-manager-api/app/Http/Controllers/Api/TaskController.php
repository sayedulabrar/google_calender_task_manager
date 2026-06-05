<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    public function index()
    {
        return response()->json(
            Task::orderBy('start_date')
                ->orderBy('start_time')
                ->get()
        );
    }

    public function store(StoreTaskRequest $request)
    {
        $task = Task::create($request->validated());

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return response()->json($task);
    }

    public function update(
        UpdateTaskRequest $request,
        Task $task
    ) {
        $task->update($request->validated());

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'message' => 'Task deleted'
        ]);
    }
}