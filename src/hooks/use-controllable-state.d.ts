import * as React from 'react';

export interface UseControllableStateProps<T> {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>(
  props: UseControllableStateProps<T>
): [T, (value: T | ((prev: T) => T)) => void];
