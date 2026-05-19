import { useCallback, useEffect, useRef, useState } from 'react';
import { getUserSkillCardData } from './user-skill-card.api';
import type {
  UserSkillCardData,
  UserSkillCardLoadState,
  UserSkillCardQuery,
} from './user-skill-card.types';

type UseUserSkillCardDataOptions = UserSkillCardQuery & {
  initialData?: UserSkillCardData;
  skipInitialLoad?: boolean;
};

const getInitialState = (initialData?: UserSkillCardData): UserSkillCardLoadState => {
  if (initialData) {
    return {
      status: 'success',
      data: initialData,
      error: null,
    };
  }

  return {
    status: 'loading',
    data: null,
    error: null,
  };
};

export const useUserSkillCardData = ({
  userId,
  skillId,
  initialData,
  skipInitialLoad = Boolean(initialData),
}: UseUserSkillCardDataOptions = {}) => {
  const [state, setState] = useState<UserSkillCardLoadState>(() => getInitialState(initialData));
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const loadData = useCallback(
    async (signal?: AbortSignal) => {
      // Защищает от устаревших ответов, если retry или смена query запустили новый запрос.
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      const isCurrentRequest = () => requestIdRef.current === requestId && !signal?.aborted;

      // Оставляем текущую карточку на экране во время обновления, чтобы не было мигания loading.
      setState((current) => (current.status === 'success' ? current : getInitialState()));

      try {
        const data = await getUserSkillCardData({ userId, skillId, signal });

        if (!isCurrentRequest()) {
          return;
        }

        if (!data) {
          setState({
            status: 'empty',
            data: null,
            error: null,
          });
          return;
        }

        setState({
          status: 'success',
          data,
          error: null,
        });
      } catch (error) {
        if (!isCurrentRequest()) {
          return;
        }

        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : 'Не удалось загрузить данные',
        });
      }
    },
    [skillId, userId]
  );

  useEffect(() => {
    if (skipInitialLoad) {
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    void loadData(controller.signal);

    return () => {
      controller.abort();
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    };
  }, [loadData, skipInitialLoad]);

  const retry = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    void loadData(controller.signal);
  }, [loadData]);

  return {
    ...state,
    retry,
  };
};
