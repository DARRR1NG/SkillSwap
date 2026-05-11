import clsx from 'clsx';
import { type ChangeEvent, type HTMLAttributes, useEffect, useId, useRef, useState } from 'react';
import type { SkillCategoryOption } from '../../lib/skills';
import s from './skill-checkboxes.module.css';

export type SkillCheckboxesProps = {
  title?: string;
  categories: SkillCategoryOption[];
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;
  onSelectedChange?: (selectedIds: string[]) => void;
  showAllLabel?: string;
  onShowAllClick?: () => void;
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'>;

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg className={s.chevron} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path
      d={expanded ? 'M3 10.5 8 5.5l5 5' : 'M3 5.5l5 5 5-5'}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

type CheckboxOptionProps = {
  label: string;
  value: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const CheckboxOption = ({
  label,
  value,
  checked,
  indeterminate = false,
  onChange,
}: CheckboxOptionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      // indeterminate задаётся только через DOM-свойство; data-атрибут нужен для стабильной CSS-стилизации
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className={s.option}>
      <input
        ref={inputRef}
        className={s.input}
        type="checkbox"
        value={value}
        checked={checked}
        aria-checked={indeterminate ? 'mixed' : checked}
        data-indeterminate={indeterminate || undefined}
        onChange={onChange}
      />
      <span className={s.box} aria-hidden="true" />
      <span className={s.label}>{label}</span>
    </label>
  );
};

export const SkillCheckboxes = ({
  title,
  categories,
  selectedIds,
  defaultSelectedIds = [],
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  onSelectedChange,
  showAllLabel,
  onShowAllClick,
  className,
  ...rest
}: SkillCheckboxesProps) => {
  const groupId = useId();
  const titleId = title ? `${groupId}-title` : undefined;
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(defaultExpandedIds);
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedIds);

  const currentSelectedIds = selectedIds ?? internalSelectedIds;
  const currentExpandedIds = expandedIds ?? internalExpandedIds;

  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const updateSelectedIds = (nextSelectedIds: string[]) => {
    if (selectedIds === undefined) {
      setInternalSelectedIds(nextSelectedIds);
    }

    onSelectedChange?.(nextSelectedIds);
  };

  const handleStandaloneCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;
    const nextSelectedIds = checked
      ? Array.from(new Set([...currentSelectedIds, value]))
      : currentSelectedIds.filter((id) => id !== value);

    updateSelectedIds(nextSelectedIds);
  };

  const updateExpandedIds = (nextExpandedIds: string[]) => {
    if (expandedIds === undefined) {
      setInternalExpandedIds(nextExpandedIds);
    }

    onExpandedChange?.(nextExpandedIds);
  };

  const handleCategoryCheckboxChange =
    (skillIds: string[]) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextSelectedIds = event.target.checked
        ? Array.from(new Set([...currentSelectedIds, ...skillIds]))
        : currentSelectedIds.filter((id) => !skillIds.includes(id));

      updateSelectedIds(nextSelectedIds);
    };

  const toggleExpanded = (categoryId: string) => {
    updateExpandedIds(
      currentExpandedIds.includes(categoryId)
        ? currentExpandedIds.filter((id) => id !== categoryId)
        : [...currentExpandedIds, categoryId]
    );
  };

  return (
    <section className={clsx(s.root, className)} aria-labelledby={titleId} {...rest}>
      {title && (
        <h3 className={s.title} id={titleId}>
          {title}
        </h3>
      )}

      <div className={s.list}>
        {categories.map((category) => {
          const categorySkills = category.skills ?? [];
          const skillIds = categorySkills.map((skill) => skill.id);
          const hasSkills = categorySkills.length > 0;
          const isExpanded = currentExpandedIds.includes(category.id);
          const skillsId = `${groupId}-${category.id}-skills`;
          const selectedSkillCount = skillIds.filter((id) =>
            currentSelectedIds.includes(id)
          ).length;
          const isCategoryChecked = hasSkills
            ? selectedSkillCount === skillIds.length
            : currentSelectedIds.includes(category.id);
          const isCategoryIndeterminate = hasSkills
            ? selectedSkillCount > 0 && selectedSkillCount < skillIds.length
            : false;

          return (
            <div className={s.category} key={category.id}>
              <div className={s.categoryHeader}>
                <CheckboxOption
                  label={category.label}
                  value={category.id}
                  checked={isCategoryChecked}
                  indeterminate={isCategoryIndeterminate}
                  onChange={
                    hasSkills
                      ? handleCategoryCheckboxChange(skillIds)
                      : handleStandaloneCheckboxChange
                  }
                />

                {hasSkills && (
                  <button
                    className={s.toggle}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={skillsId}
                    aria-label={
                      isExpanded ? `Свернуть ${category.label}` : `Развернуть ${category.label}`
                    }
                    onClick={() => toggleExpanded(category.id)}
                  >
                    <ChevronIcon expanded={isExpanded} />
                  </button>
                )}
              </div>

              {hasSkills && isExpanded && (
                <div className={s.sublist} id={skillsId}>
                  {categorySkills.map((skill) => (
                    <CheckboxOption
                      key={skill.id}
                      label={skill.label}
                      value={skill.id}
                      checked={currentSelectedIds.includes(skill.id)}
                      onChange={handleStandaloneCheckboxChange}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAllLabel && (
        <button className={s.showAll} type="button" onClick={onShowAllClick}>
          <span>{showAllLabel}</span>
          <ChevronIcon expanded={false} />
        </button>
      )}
    </section>
  );
};
