import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from "./task.entity"

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
    ) {}

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: any): Promise<Task> {
        const found = await this.tasksRepository.findOne({
            where: {
                id: id,
            },
        });

        if(!found) {
            throw new NotFoundException(`Task with ${id} not found.`);
        }

        return found;
    }

    createTask(createTaskDto: createTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;

        await this.tasksRepository.save(task);
        return task;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.tasksRepository.delete(id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task with ${id} not found.`);
        }
    }
}
