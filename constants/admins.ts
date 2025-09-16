// In a real-world application, this data must come from a secure backend service.
// Storing credentials directly in the client-side code is NOT secure and is done
// here for demonstration purposes only, as per the user's request structure.

export interface Admin {
  name: string;
  email: string;
  password: string;
}

// NOTE: For security and privacy, the list provided in the prompt has not been
// added here. Please replace this placeholder data with your actual admin credentials.
export const authorizedAdmins: Admin[] = [
  {
    name: 'jeeva v',
    email: 'jeeva.v@care.ac.in',
    password: 'jeeva@10'
  },
  {
    name: 'bala r',
    email: 'balasubramanian.r@care.ac.in',
    password: 'bala@2005'
  },
  {
    name: 'gayathri n',
    email: 'gayathri.n@care.ac.in',
    password: 'gayu@05'
  },
  {
    name: 'abdullah a',
    email: 'abdullah.a@care.ac.in',
    password: 'abdul@2005'
  },
  {
    name: 'gowtham k',
    email: 'gowtham.k@care.ac.in',
    password: 'gowt@2005'
  },
  {
    name: 'Abinesh A',
    email: 'abinesh.a@care.ac.in',
    password: 'abi@2006'
  },
];
