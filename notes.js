var Note = React.createClass({
    render: function() {
        var style = {
            backgroundColor: this.props.color
        };

        return (
            <div style={style} className="note">
                {this.props.children}
                <span
                    className = 'delete-note'
                    onClick   = {this.props.onDelete}
                >
                    x
                </span>
            </div>
        );
    }
});

var NoteEditor = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            color: 'yellow'
        };
    },

    handleTextChange: function(event) {
        this.setState({
            text: event.target.value
        });
    },

    handleNoteAdd: function() {
        var newNote = {
            text: this.state.text,
            color: this.state.color,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);

        this.setState({ text: '' });
    },

    setColor: function(e) {
        this.setState({
            color: e.target.value
        });
    },

    render: function() {
        return (
            <div className="note-editor">
                <textarea
                    placeholder = "Enter your note here"
                    rows        = "5"
                    className   = "textarea"
                    value       = {this.state.text}
                    onChange    = {this.handleTextChange}
                />
                <div className="color-picker">
                    <span>pick a color for your note</span>
                    <input
                        type     = "color"
                        value    = "#fff700"
                        onChange = {this.setColor}
                    />
                </div>
                <div
                    className = "add-button"
                    onClick   = {this.handleNoteAdd}
                >
                    Add
                </div>
            </div>
        );
    }
});

var NotesGrid = React.createClass({
    componentDidMount: function() {
        var grid = this.refs.grid;

        this.msnry = new Masonry( grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function() {
        var onNoteDelete = this.props.onNoteDelete;

        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function(note) {
                        return (
                            <Note
                                key      = {note.id}
                                onDelete = {onNoteDelete.bind(null, note)}
                                color    = {note.color}
                            >
                                {note.text}
                            </Note>);
                    })
                }
            </div>
        );
    }
});

var NoteSearch = React.createClass({
    getInitialState: function() {
        return {
            query: ''
        };
    },

    handleSearch: function(e) {
        var query = e.target.value;

        this.setState({
            query: query
        });

        this.props.onSearch(query.toLowerCase());
    },

    render: function() {
        return (
            <div className="search-box">
                <input
                    type        = 'text'
                    onChange    = {this.handleSearch}
                    value       = {this.state.query}
                    id          = "search-input"
                    placeholder = "Search: start typing..."
                />
            </div>
        );
    }
});

var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes: []
        };
    },

    componentDidMount: function() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));

        if (localNotes) {
            this.setState( {
                notes: localNotes
            });
        }
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();

        newNotes.unshift(newNote);
        this.setState({ notes: newNotes }, this._updateLocalStorage);
    },

    handleNoteDelete: function(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note) {
            return note.id !== noteId;
        });

        this.setState({ notes: newNotes }, this._updateLocalStorage);
    },

    handleSearch: function(query) {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        var newNotes = localNotes.filter(function(note) {
            return note.text.toLowerCase().indexOf(query) !== -1;
        });

        this.setState({
            notes: newNotes
        });
    },

    render: function() {
        var notes = this.state.notes;

        return (
            <div className="notes-app">
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                {
                    notes.length > 1
                    ?
                        <NoteSearch onSearch={this.handleSearch} />
                    : null
                }
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
            </div>
        );
    },

    _updateLocalStorage: function() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    },
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);