// Admin page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin page loaded');

    // Venue editing functionality
    const editableCells = document.querySelectorAll('.editable');
    
    if (editableCells.length > 0) {
        editableCells.forEach(cell => {
            const valueSpan = cell.querySelector('.value');
            const input = cell.querySelector('.edit-input');
            
            if (valueSpan && input) {
                cell.addEventListener('click', function(e) {
                    if (e.target === input) return;
                    valueSpan.style.display = 'none';
                    input.style.display = 'block';
                    input.focus();
                    input.select();
                });
                
                input.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
                
                input.addEventListener('blur', function() {
                    const newValue = input.value;
                    const venueId = cell.dataset.venueId;
                    const fieldName = cell.dataset.field;
                    
                    fetch('/admin/update-venue', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            venueId: venueId,
                            fieldName: fieldName,
                            fieldValue: newValue
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const formattedValue = parseInt(newValue).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                            
                            if (fieldName === 'capacity') {
                                valueSpan.textContent = formattedValue;
                            } else {
                                valueSpan.textContent = '₱' + formattedValue;
                            }
                            
                            input.style.display = 'none';
                            valueSpan.style.display = 'inline';
                        }
                    })
                    .catch(error => {
                        console.error('Error updating venue:', error);
                        input.style.display = 'none';
                        valueSpan.style.display = 'inline';
                    });
                });
                
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        input.blur();
                    }
                });
            }
        });
    }
});

