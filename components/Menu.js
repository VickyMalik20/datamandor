import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Memasukkan CSS Bootstrap
import Link from 'next/link'

export default function Menu() {
    useEffect(() => {
        // Memuat Bootstrap JS hanya di sisi klien
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Membersihkan script setelah komponen unmount
        };
    }, []);

    const toggleDropdown = (dropdownId) => {
        const dropdown = document.getElementById(dropdownId);

        // Menutup dropdown yang terbuka (jika ada)
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        allDropdowns.forEach((menu) => {
            if (menu !== dropdown) {
                menu.classList.remove('show', 'animate-dropdown');
                menu.classList.add('animate-dropdown-exit');
                setTimeout(() => {
                    menu.classList.remove('animate-dropdown-exit');
                }, 300); // Durasi animasi keluar
            }
        });

        // Membuka atau menutup dropdown yang dipilih
        if (dropdown.classList.contains('show')) {
            // Tutup dropdown dengan animasi keluar
            dropdown.classList.remove('animate-dropdown');
            dropdown.classList.add('animate-dropdown-exit');

            setTimeout(() => {
                dropdown.classList.remove('animate-dropdown-exit');
                dropdown.classList.remove('show');
            }, 300); // Durasi animasi keluar
        } else {
            // Buka dropdown dengan animasi masuk
            dropdown.classList.add('show');
            dropdown.classList.add('animate-dropdown');
        }
    };




    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand">UD Sinar Mandiri</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link href="/" className="nav-link">Home</Link>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                id="berasDropdown"
                                role="button"
                                onClick={() => toggleDropdown('dropdownMenu')}
                                aria-expanded="false"
                            >
                                Beras Polos
                            </a>
                            <ul
                                id="dropdownMenu"
                                className="dropdown-menu animate-dropdown"
                                aria-labelledby="berasDropdown"
                            >
                                <li>
                                    <Link href="/beraspolos/beras-a" className="dropdown-item">Beras A</Link>
                                </li>
                                <li>
                                    <Link href="/beraspolos/beras-b" className="dropdown-item">Beras B</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                id="bsDropdown"
                                role="button"
                                onClick={() => toggleDropdown('dropdownMenubs')}
                                aria-expanded="false"
                            >
                                BS
                            </a>
                            <ul
                                id="dropdownMenubs"
                                className="dropdown-menu animate-dropdown"
                                aria-labelledby="bsDropdown"
                            >
                                <li>
                                    <Link href="/bs/5" className="dropdown-item">5 KG</Link>
                                </li>
                                <li>
                                    <Link href="/bs/10" className="dropdown-item">10 KG</Link>
                                </li>
                                <li>
                                    <Link href="/bs/25" className="dropdown-item">25 KG</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                id="agDropdown"
                                role="button"
                                onClick={() => toggleDropdown('dropdownMenuag')}
                                aria-expanded="false"
                            >
                                AG
                            </a>
                            <ul
                                id="dropdownMenuag"
                                className="dropdown-menu animate-dropdown"
                                aria-labelledby="agDropdown"
                            >
                                <li>
                                    <Link href="/ag/5" className="dropdown-item">5 KG</Link>
                                </li>
                                <li>
                                    <Link href="/ag/25" className="dropdown-item">25 KG</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link dropdown-toggle"
                                id="rjDropdown"
                                role="button"
                                onClick={() => toggleDropdown('dropdownMenurj')}
                                aria-expanded="false"
                            >
                                Riject
                            </a>
                            <ul
                                id="dropdownMenurj"
                                className="dropdown-menu animate-dropdown"
                                aria-labelledby="rjDropdown"
                            >
                                <li>
                                    <Link href="/riject/menir" className="dropdown-item">Menir</Link>
                                </li>
                                <li>
                                    <Link href="/riject/beras" className="dropdown-item">Beras</Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <Link href="/menir/menir" className="nav-link">Menir</Link>
                        </li>

                        <li className="nav-item">
                            <Link href="/broken/broken" className="nav-link">Broken</Link>
                        </li>

                        <li className="nav-item">
                            <Link href="/bronir/bronir" className="nav-link">Bronir</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/about" className="nav-link">About</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
