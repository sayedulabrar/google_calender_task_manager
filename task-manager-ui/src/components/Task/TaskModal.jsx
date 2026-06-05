import React from 'react';
import { Modal } from '../Common/Modal';
import { TaskForm } from './TaskForm';

/**
 * TaskModal component - wraps TaskForm in a modal
 */
export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialTask,
  taskDefaults,
  loading = false,
}) => {
  const title = initialTask ? 'Edit Task' : 'Create New Task';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <TaskForm
        initialTask={initialTask}
        taskDefaults={taskDefaults}
        onSubmit={onSubmit}
        onCancel={onClose}
        onDelete={onDelete}
        loading={loading}
      />
    </Modal>
  );
};

export default TaskModal;
