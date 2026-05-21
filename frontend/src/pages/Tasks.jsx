import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDirections } from '../api/directions';
import { getTasks, completeTask } from '../api/tasks';
import { useLanguage } from '../context/LanguageContext';
import { DIRECTION_ICONS } from '../components/Icons';
import ScrollReveal from '../components/ScrollReveal';
import { taskDirectionIntro, taskDirectionTitle } from '../utils/taskLabels';

function Tasks() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const directionSlug = searchParams.get('direction');

  const [directions, setDirections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    async function loadDirections() {
      try {
        const data = await getDirections();
        setDirections(data);
      } catch {
        setError(t('common.errorLoadDirections'));
      }
    }

    loadDirections();
  }, [t]);

  useEffect(() => {
    if (!directionSlug) {
      setTasks([]);
      setTaskIndex(0);
      setFinished(false);
      setLoading(false);
      return;
    }

    async function loadTasks() {
      setLoading(true);
      setError('');
      setFinished(false);
      setTaskIndex(0);
      try {
        const data = await getTasks(directionSlug);
        setTasks(data);
      } catch {
        setError(t('tasks.errorLoad'));
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [directionSlug, t]);

  function handleSelectDirection(slug) {
    navigate(`/tasks?direction=${slug}`);
  }

  const selectedDirection = directions.find((d) => d.slug === directionSlug);
  const activeTask = tasks[taskIndex] ?? null;
  const isLastTask = taskIndex >= tasks.length - 1;

  async function handleYana() {
    if (!activeTask) return;

    setSubmitting(true);
    setError('');

    try {
      await completeTask(activeTask.id, true);

      if (isLastTask) {
        setFinished(true);
      } else {
        setTaskIndex((i) => i + 1);
      }
    } catch {
      setError(t('tasks.errorSave'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDirectionFit(yes) {
    if (yes) {
      navigate(`/roadmap?direction=${directionSlug}`);
    } else {
      navigate('/tasks');
    }
  }

  if (!directionSlug) {
    return (
      <div className="tasks-page">
        <header className="page-header">
          <h1>{t('tasks.title')}</h1>
          <p>{t('tasks.subtitle')}</p>
        </header>

        <div className="tasks-direction-grid">
          {directions.map((direction, index) => {
            const Icon = DIRECTION_ICONS[direction.slug] || DIRECTION_ICONS.frontend;
            return (
              <ScrollReveal key={direction.id} delay={(index % 4) + 1}>
                <button
                  type="button"
                  className="tasks-direction-card"
                  onClick={() => handleSelectDirection(direction.slug)}
                >
                  <Icon size={28} />
                  <h2>{direction.name}</h2>
                  <p>{taskDirectionIntro(direction.name, t)}</p>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="page-loading">{t('common.loading')}</div>;
  }

  const directionTitle = selectedDirection
    ? taskDirectionTitle(selectedDirection.name, t)
    : t('tasks.title');

  return (
    <div className="tasks-page">
      <header className="page-header">
        <button type="button" className="back-link tasks-back-btn" onClick={() => navigate('/tasks')}>
          {t('common.backSelectDirection')}
        </button>
        <h1>{directionTitle}</h1>
        {selectedDirection && (
          <p>
            {taskDirectionIntro(selectedDirection.name, t)} {t('tasks.readSequentially')}
          </p>
        )}
      </header>

      {tasks.length === 0 && (
        <p className="tasks-empty">{t('tasks.empty')}</p>
      )}

      {finished ? (
        <main className="tasks-detail tasks-detail--single">
          <div className="tasks-finish">
            <h2>{t('tasks.finishQuestion')}</h2>
            <p>
              {t('tasks.finishText', { name: selectedDirection?.name || '' })}
            </p>
            <div className="tasks-finish-buttons">
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleDirectionFit(true)}
              >
                {t('common.yes')}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleDirectionFit(false)}
              >
                {t('common.no')}
              </button>
            </div>
          </div>
        </main>
      ) : activeTask && (
        <main className="tasks-detail tasks-detail--single">
          <div className="tasks-progress">
            <span>{t('tasks.taskProgress', { current: taskIndex + 1, total: tasks.length })}</span>
            <div className="tasks-progress-bar">
              <div
                className="tasks-progress-fill"
                style={{ width: `${((taskIndex + 1) / tasks.length) * 100}%` }}
              />
            </div>
          </div>

          <h2>{activeTask.title}</h2>
          <p className="tasks-description">{activeTask.description}</p>

          <div className="tasks-instruction">
            <h3>{t('tasks.taskHeading')}</h3>
            <p>{activeTask.instruction}</p>
          </div>

          {activeTask.task_data?.term_hint && (
            <div className="tasks-hint">
              {t('tasks.whyTask', { hint: activeTask.task_data.term_hint })}
            </div>
          )}

          <div className="tasks-next">
            <button
              type="button"
              className="btn-primary tasks-yana-btn"
              onClick={handleYana}
              disabled={submitting}
            >
              {submitting ? t('common.saving') : t('tasks.next')}
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}
        </main>
      )}
    </div>
  );
}

export default Tasks;
