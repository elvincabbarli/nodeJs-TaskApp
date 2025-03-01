import Task from "../models/task.js";

export const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exsistingTaks = await Task.findOne({ title });
    if (exsistingTaks) {
      return res.status(400).json({ message: "Task already exists" });
    }

    const newTask = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPersonalTasks = async (req, res) => {
  try {
    await req.user.populate("tasks");
    res.status(200).json(req.user.tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    let {
      completed,
      page = 1,
      limit = 10,
      sortBy = "createdAt:asc",
    } = req.query;

    if (completed === "") {
      completed = undefined;
    }

    const filter =
      completed !== undefined ? { completed: completed === "true" } : {};
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const skip = (page - 1) * limit;

    const sort = {};
    if (req.query.sortBy) {
      const parts = sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    const tasks = await Task.find(filter).sort(sort).skip(skip).limit(limit);

    const totalTasks = await Task.countDocuments(filter);

    res.status(200).json({
      tasks,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
      limit,
      sortBy,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const findTheTask = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    const updatedTask = Object.assign(findTheTask, req.body);
    await updatedTask.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedTask = await Task.findOneAndDelete({
      _id,
      owner: req.user._id,
    });
    res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
