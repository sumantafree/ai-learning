from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from backend.models.task import Task, TaskStatus
from backend.models.user import User
from backend.schemas.task import TaskCreate, TaskUpdate


def create_task(db: Session, owner_id: int, data: TaskCreate) -> Task:
    task = Task(owner_id=owner_id, **data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: int, owner_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id, Task.owner_id == owner_id).first()


def get_tasks(
    db: Session,
    owner_id: int,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> list[Task]:
    query = db.query(Task).filter(Task.owner_id == owner_id)
    if status:
        query = query.filter(Task.status == status)
    return query.order_by(Task.created_at.desc()).offset(skip).limit(limit).all()


def update_task(db: Session, task: Task, data: TaskUpdate) -> Task:
    updates = data.model_dump(exclude_unset=True)

    # If marking as completed, record timestamp and award XP
    if updates.get("status") == TaskStatus.completed and task.status != TaskStatus.completed:
        updates["completed_at"] = datetime.now(timezone.utc)
        _award_xp(db, task.owner_id, task.xp_reward)

    for field, value in updates.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()


def _award_xp(db: Session, user_id: int, xp: int) -> None:
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.xp_points += xp
        user.total_tasks_completed += 1
        db.commit()


def get_user_stats(db: Session, owner_id: int) -> dict:
    total = db.query(Task).filter(Task.owner_id == owner_id).count()
    completed = db.query(Task).filter(
        Task.owner_id == owner_id, Task.status == TaskStatus.completed
    ).count()
    pending = db.query(Task).filter(
        Task.owner_id == owner_id, Task.status == TaskStatus.pending
    ).count()
    in_progress = db.query(Task).filter(
        Task.owner_id == owner_id, Task.status == TaskStatus.in_progress
    ).count()

    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "in_progress": in_progress,
        "completion_rate": round((completed / total * 100) if total else 0, 1),
    }
