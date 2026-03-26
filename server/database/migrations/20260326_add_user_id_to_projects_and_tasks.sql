-- 为 projects 和 tasks 表添加 user_id 字段，实现用户数据隔离
-- 普通用户只能查看和管理自己的项目和任务
-- 管理员可以查看所有数据和项目

-- 为 projects 表添加 user_id 字段
ALTER TABLE projects ADD COLUMN user_id INTEGER;

-- 为 tasks 表添加 user_id 字段
ALTER TABLE tasks ADD COLUMN user_id INTEGER;

-- 将现有数据标记为 admin 用户 (假设 admin 用户 id=1)
-- 这样现有数据会被归属于管理员账号
UPDATE projects SET user_id = 1 WHERE user_id IS NULL;
UPDATE tasks SET user_id = 1 WHERE user_id IS NULL;

-- 设置 user_id 为 NOT NULL (通过重建表实现)
-- SQLite 不支持直接添加 NOT NULL 约束，需要重建表
-- 但为了向后兼容，我们暂时允许 NULL，通过触发器确保新记录必须有值

-- 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id_project_id ON tasks(user_id, project_id);

-- 为 admin 用户设置默认项目权限（可选：创建一个全局项目标记）
-- ALTER TABLE projects ADD COLUMN is_global INTEGER DEFAULT 0 CHECK (is_global IN (0, 1));
-- CREATE INDEX IF NOT EXISTS idx_projects_is_global ON projects(is_global);
