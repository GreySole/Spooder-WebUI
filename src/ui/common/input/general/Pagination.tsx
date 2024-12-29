import { faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Box from '../../layout/Box';
import Button from '../controlled/Button';
import TypeFace from '../../layout/TypeFace';

interface PaginationProps {
  pageTitles: string[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  endAction?: () => void;
}

export default function Pagination(props: PaginationProps) {
  const { pageTitles, currentPage, setCurrentPage, handleNext, handlePrevious, endAction } = props;

  const circleRadius = 7;

  const circleSpacing = (1 / pageTitles.length) * 100;
  const svgHeight = 2 * circleRadius + 2;
  return (
    <Box justifyContent='space-between' alignItems='center'>
      <Button
        icon={faArrowLeft}
        iconSize='large'
        onClick={handlePrevious}
        disabled={currentPage === 0}
      />
      <Box flexFlow='column' width='100%'>
        <TypeFace fontSize='medium' textAlign='center'>
          {pageTitles[currentPage]}
        </TypeFace>
        <Box width='100%' padding='small'>
          <svg width='100%' height={svgHeight}>
            <line
              x1='0'
              y1={svgHeight / 2}
              x2='100%'
              y2={svgHeight / 2}
              stroke='var(--button-border-color)'
              strokeWidth={2}
            />
            {pageTitles.map((_, index) => (
              <circle
                key={index}
                cx={`${circleSpacing / 2 + index * circleSpacing}%`}
                cy={svgHeight / 2}
                r={circleRadius}
                fill={
                  index === currentPage
                    ? 'var(--button-background-color)'
                    : 'var(--color-background-far)'
                }
                stroke='var(--button-border-color)'
                strokeWidth={2}
              />
            ))}
          </svg>
        </Box>
      </Box>

      <Button
        icon={endAction && currentPage === pageTitles.length - 1 ? faCheck : faArrowRight}
        iconSize='large'
        onClick={handleNext}
        disabled={!endAction ? currentPage === pageTitles.length - 1 : false}
      />
    </Box>
  );
}
