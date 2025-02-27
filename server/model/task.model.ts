import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    status: "To Do" | "On Progress" | "Done" | "Timeout";
    priority: "Low" | "Medium" | "High" | "Completed";
    deadline: Date;
}

const TaskSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: ["To Do", "On Progress", "Done", "Timeout"], default: "To Do" },
        priority: { type: String, enum: ["Low", "Medium", "High", "Completed"], default: "Low" },
        deadline: { type: Date, required: true },
    },
    { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
