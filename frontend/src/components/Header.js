import React from 'react';
import styled from 'styled-components';
// Import your logo here. Make sure to place the logo file in an assets folder.
// For example: import logo from '../assets/logo.png';

const HeaderContainer = styled.header`
  background-color: #35518a;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.img`
  height: 50px; // Adjust as needed

  // If you use a placeholder, you might want to style it
  // For now, we assume an image file.
`;

const PlaceholderLogo = styled.div`
    height: 50px;
    width: 150px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #35518a;
    font-weight: bold;
    border-radius: 4px;
`;


const Header = () => {
  return (
    <HeaderContainer>
        {/* Replace this PlaceholderLogo with your <Logo src={logo} alt="Company Logo" /> */}
      <PlaceholderLogo>Sua Logo Aqui</PlaceholderLogo>
    </HeaderContainer>
  );
};

export default Header;
