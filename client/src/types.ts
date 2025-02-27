export type Task = {
    _id: any;
    id: string;
    title: string;
    description: string;
    status: "To Do" | "On Progress" | "Done" | "Timeout";
    priority: "Low" | "Medium" | "High" | "Completed";
    deadline: string;
};
