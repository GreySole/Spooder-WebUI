import React, { ReactNode, useState } from 'react';
import Box from '../../layout/Box';
import Button from '../controlled/Button';
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import TypeFace from '../../layout/TypeFace';
import Pagination from './Pagination';

interface ModalPage {
  title: string;
  content: ReactNode;
}

interface ModalProps {
  title: string;
  pages: ModalPage[];
  footerContent: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ title, pages, isOpen, onClose, footerContent }: ModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!isOpen) {
    return null;
  }

  const _onClose = () => {
    setCurrentPage(0);
    onClose();
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className='modal-overlay'>
      <Box flexFlow='column'>
        <Box
          classes={['modal-header']}
          justifyContent='space-between'
          alignItems='center'
          padding='small'
        >
          <TypeFace fontSize='xlarge'>{title}</TypeFace>
          <Button icon={faX} iconSize='large' onClick={_onClose} />
        </Box>
      </Box>

      <div className='modal-content'>
        <div className='modal-body'>{pages[currentPage].content}</div>
      </div>
      <Box classes={['modal-footer']} flexFlow='column' padding='medium'>
        <Pagination
          pageTitles={pages.map((page) => page.title)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          endAction={() => {}}
        />
        {footerContent}
      </Box>
    </div>
  );
}
