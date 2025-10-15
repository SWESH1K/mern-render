import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BUTTONS = [
	['7', '8', '9', '/'],
	['4', '5', '6', '*'],
	['1', '2', '3', '-'],
	['0', '.', 'C', '+'],
];

export default function App() {
	const [expression, setExpression] = useState('');
	const [result, setResult] = useState(null);
	const [history, setHistory] = useState([]);
	const [error, setError] = useState('');
	const [isCalculating, setIsCalculating] = useState(false);

	useEffect(() => {
		fetchHistory();
	}, []);

	const fetchHistory = async () => {
		try {
			const res = await axios.get('/api/history');
			setHistory(res.data);
		} catch (err) {
			setHistory([]);
		}
	};

	const handleButtonClick = (val) => {
		setError('');
		if (val === 'C') {
			setExpression('');
			setResult(null);
			return;
		}
		setExpression((prev) => prev + val);
	};

	const handleEquals = async () => {
		if (!expression) return;
		setError('');
		setIsCalculating(true);
		try {
			const res = await axios.post('/api/calculate', { expression });
			setResult(res.data.result);
			setExpression('');
			fetchHistory();
		} catch (err) {
			setError(err.response?.data?.error || 'Error calculating');
		} finally {
			setIsCalculating(false);
		}
	};

	// Modern calculator style
	return (
		<div style={{
			minHeight: '100vh',
			background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
		}}>
			<div style={{
				background: 'rgba(255,255,255,0.05)',
				borderRadius: 24,
				boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
				backdropFilter: 'blur(8px)',
				border: '1px solid rgba(255,255,255,0.18)',
				padding: 32,
				width: 340,
				maxWidth: '90vw',
			}}>
				<h2 style={{ color: '#fff', textAlign: 'center', letterSpacing: 2, marginBottom: 16 }}>MERN Calculator</h2>
				<div style={{
					background: 'rgba(0,0,0,0.15)',
					borderRadius: 12,
					padding: 16,
					minHeight: 60,
					color: '#fff',
					fontSize: 28,
					textAlign: 'right',
					marginBottom: 8,
					wordBreak: 'break-all',
					boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.12)'
				}}>
					{expression || (result !== null ? result : '0')}
				</div>
				{error && <div style={{ color: '#ff6b6b', marginBottom: 8, textAlign: 'right' }}>{error}</div>}
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
					{BUTTONS.flat().map((btn, i) => (
						<button
							key={btn + i}
							onClick={() => handleButtonClick(btn)}
							style={{
								padding: '18px 0',
								fontSize: 20,
								borderRadius: 10,
								border: 'none',
								background: btn === 'C' ? '#ff6b6b' : (['/', '*', '-', '+'].includes(btn) ? '#4e54c8' : '#232526'),
								color: '#fff',
								fontWeight: 600,
								boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
								cursor: 'pointer',
								transition: 'background 0.2s',
								outline: 'none',
								opacity: isCalculating ? 0.7 : 1
							}}
							disabled={isCalculating}
						>
							{btn}
						</button>
					))}
					<button
						onClick={handleEquals}
						style={{
							gridColumn: 'span 4',
							padding: '18px 0',
							fontSize: 22,
							borderRadius: 10,
							border: 'none',
							background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
							color: '#fff',
							fontWeight: 700,
							marginTop: 4,
							boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
							cursor: 'pointer',
							transition: 'background 0.2s',
							outline: 'none',
							opacity: isCalculating ? 0.7 : 1
						}}
						disabled={isCalculating}
					>
						=
					</button>
				</div>
				<div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: 12, marginTop: 10 }}>
					<h4 style={{ color: '#fff', margin: '0 0 8px 0', fontWeight: 500, fontSize: 16 }}>History</h4>
					<ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, maxHeight: 120, overflowY: 'auto' }}>
						{history.length === 0 && <li style={{ color: '#bbb', fontSize: 14 }}>No history yet.</li>}
						{history.map((item, idx) => (
							<li key={idx} style={{ marginBottom: 4, color: '#fff', fontSize: 15 }}>
								<span style={{ color: '#b2bec3' }}>{item.expression}</span> = <b>{item.result}</b>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}