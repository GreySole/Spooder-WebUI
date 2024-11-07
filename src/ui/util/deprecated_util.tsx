import React from 'react';
import { FieldValues } from 'react-hook-form';
import { KeyedObject } from '../Types';
export function $(selector: string) {
  return document.querySelector(selector);
}

export function setClass(el: Element | null, classname: string, bool: boolean) {
  if (el === null) {
    return;
  }
  if (bool == null) {
    bool = true;
  }
  if (bool) {
    el.classList.add(classname);
  } else {
    el.classList.remove(classname);
  }
}

export function toggleClass(el: Element | null, classname: string) {
  if (el === null) {
    return;
  }
  let hasClass = el.classList.contains(classname);
  if (hasClass) {
    el.classList.remove(classname);
  } else {
    el.classList.add(classname);
  }
  return el.classList.contains(classname);
}

export function radioClass(classname: string, selector: string, selected: Element | null) {
  if (selected === null) {
    return;
  }
  let selectGroup = document.querySelectorAll(selector);
  selectGroup.forEach((e, i) => {
    e.classList.remove(classname);
  });

  selected.classList.add(classname);
}
